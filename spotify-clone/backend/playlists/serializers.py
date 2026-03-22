from rest_framework import serializers
from music.serializers import TrackSerializer
from .models import Playlist, PlaylistTrack


class PlaylistListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for playlist lists."""
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    cover_url = serializers.SerializerMethodField()
    track_count = serializers.SerializerMethodField()

    class Meta:
        model = Playlist
        fields = (
            'id', 'name', 'description', 'owner', 'owner_name',
            'cover_url', 'is_public', 'track_count', 'created_at',
        )
        read_only_fields = ('id', 'owner', 'created_at')

    def get_cover_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None

    def get_track_count(self, obj):
        return obj.tracks.count()


class PlaylistDetailSerializer(serializers.ModelSerializer):
    """Full playlist with nested tracks in order."""
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    cover_url = serializers.SerializerMethodField()
    tracks = serializers.SerializerMethodField()

    class Meta:
        model = Playlist
        fields = (
            'id', 'name', 'description', 'owner', 'owner_name',
            'cover_url', 'is_public', 'tracks', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at')

    def get_cover_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None

    def get_tracks(self, obj):
        # Respect position ordering defined in PlaylistTrack
        playlist_tracks = PlaylistTrack.objects.filter(playlist=obj).select_related(
            'track', 'track__artist', 'track__album'
        ).order_by('position', 'added_at')
        tracks = [pt.track for pt in playlist_tracks]
        return TrackSerializer(tracks, many=True, context=self.context).data


class PlaylistCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = ('id', 'name', 'description', 'cover_image', 'is_public')


class AddTrackSerializer(serializers.Serializer):
    track_id = serializers.IntegerField()