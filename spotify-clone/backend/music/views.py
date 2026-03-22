from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

from .models import Artist, Album, Track
from .serializers import (
    ArtistSerializer, AlbumListSerializer,
    AlbumDetailSerializer, TrackSerializer,
)


# ─── Custom Pagination ────────────────────────────────────────────────────────

class TrackPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 10000


# ─── Artist Views ─────────────────────────────────────────────────────────────

class ArtistListView(generics.ListAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ArtistDetailView(generics.RetrieveAPIView):
    queryset = Artist.objects.prefetch_related('albums', 'tracks')
    permission_classes = (permissions.IsAuthenticated,)

    def retrieve(self, request, *args, **kwargs):
        artist = self.get_object()
        artist_data = ArtistSerializer(artist, context={'request': request}).data
        albums = Album.objects.filter(artist=artist)
        artist_data['albums'] = AlbumListSerializer(
            albums, many=True, context={'request': request}
        ).data
        return Response(artist_data)


# ─── Album Views ──────────────────────────────────────────────────────────────

class AlbumListView(generics.ListAPIView):
    queryset = Album.objects.select_related('artist').all()
    serializer_class = AlbumListSerializer
    permission_classes = (permissions.IsAuthenticated,)


class AlbumDetailView(generics.RetrieveAPIView):
    queryset = Album.objects.select_related('artist').prefetch_related('tracks__artist')
    serializer_class = AlbumDetailSerializer
    permission_classes = (permissions.IsAuthenticated,)


# ─── Track Views ──────────────────────────────────────────────────────────────

class TrackListView(generics.ListAPIView):
    queryset = Track.objects.select_related('artist', 'album').all()
    serializer_class = TrackSerializer
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = TrackPagination


class TrackDetailView(generics.RetrieveAPIView):
    queryset = Track.objects.select_related('artist', 'album')
    serializer_class = TrackSerializer
    permission_classes = (permissions.IsAuthenticated,)


class IncrementPlayCountView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        try:
            track = Track.objects.get(pk=pk)
            track.increment_play_count()
            return Response({'play_count': track.play_count})
        except Track.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)


# ─── Like / Unlike Track ──────────────────────────────────────────────────────

class LikeTrackView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        try:
            track = Track.objects.get(pk=pk)
        except Track.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if user.liked_tracks.filter(id=track.id).exists():
            user.liked_tracks.remove(track)
            liked = False
        else:
            user.liked_tracks.add(track)
            liked = True

        return Response({'liked': liked, 'track_id': track.id})


class LikedTracksView(generics.ListAPIView):
    serializer_class = TrackSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return self.request.user.liked_tracks.select_related('artist', 'album').all()


# ─── Search ───────────────────────────────────────────────────────────────────

class SearchView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({'tracks': [], 'albums': [], 'artists': []})

        tracks = Track.objects.filter(
            Q(title__icontains=query) |
            Q(artist__name__icontains=query) |
            Q(album__title__icontains=query)
        ).select_related('artist', 'album')[:20]

        albums = Album.objects.filter(
            Q(title__icontains=query) |
            Q(artist__name__icontains=query)
        ).select_related('artist')[:10]

        artists = Artist.objects.filter(
            Q(name__icontains=query)
        )[:10]

        return Response({
            'tracks': TrackSerializer(tracks, many=True, context={'request': request}).data,
            'albums': AlbumListSerializer(albums, many=True, context={'request': request}).data,
            'artists': ArtistSerializer(artists, many=True, context={'request': request}).data,
        })