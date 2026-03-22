from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from music.models import Track
from .models import Playlist, PlaylistTrack
from .serializers import (
    PlaylistListSerializer, PlaylistDetailSerializer,
    PlaylistCreateUpdateSerializer, AddTrackSerializer,
)


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Only the owner may modify; others may read public playlists."""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.is_public or obj.owner == request.user
        return obj.owner == request.user


class PlaylistListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/playlists/        — list current user's playlists
    POST /api/playlists/        — create a new playlist
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Playlist.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PlaylistCreateUpdateSerializer
        return PlaylistListSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        playlist = serializer.save(owner=request.user)
        # Return full detail after creation
        return Response(
            PlaylistDetailSerializer(playlist, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class PlaylistDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/playlists/<id>/ — playlist detail with tracks
    PATCH  /api/playlists/<id>/ — update name/description
    DELETE /api/playlists/<id>/ — delete playlist
    """
    queryset = Playlist.objects.all()
    permission_classes = (permissions.IsAuthenticated, IsOwnerOrReadOnly)

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return PlaylistCreateUpdateSerializer
        return PlaylistDetailSerializer

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        playlist = serializer.save()
        return Response(
            PlaylistDetailSerializer(playlist, context={'request': request}).data
        )


class AddTrackToPlaylistView(APIView):
    """POST /api/playlists/<id>/tracks/ — add a track to a playlist."""
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        try:
            playlist = Playlist.objects.get(pk=pk, owner=request.user)
        except Playlist.DoesNotExist:
            return Response({'detail': 'Playlist not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AddTrackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            track = Track.objects.get(pk=serializer.validated_data['track_id'])
        except Track.DoesNotExist:
            return Response({'detail': 'Track not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Determine next position
        last_position = PlaylistTrack.objects.filter(playlist=playlist).count()
        PlaylistTrack.objects.get_or_create(
            playlist=playlist,
            track=track,
            defaults={'position': last_position},
        )

        return Response(
            PlaylistDetailSerializer(playlist, context={'request': request}).data
        )


class RemoveTrackFromPlaylistView(APIView):
    """DELETE /api/playlists/<id>/tracks/<track_id>/ — remove a track."""
    permission_classes = (permissions.IsAuthenticated,)

    def delete(self, request, pk, track_id):
        try:
            playlist = Playlist.objects.get(pk=pk, owner=request.user)
        except Playlist.DoesNotExist:
            return Response({'detail': 'Playlist not found.'}, status=status.HTTP_404_NOT_FOUND)

        deleted, _ = PlaylistTrack.objects.filter(playlist=playlist, track_id=track_id).delete()
        if not deleted:
            return Response({'detail': 'Track not in playlist.'}, status=status.HTTP_404_NOT_FOUND)

        return Response(
            PlaylistDetailSerializer(playlist, context={'request': request}).data
        )