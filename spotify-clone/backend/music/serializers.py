from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Artist, Album, Track

User = get_user_model()


class ArtistSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    track_count = serializers.SerializerMethodField()

    class Meta:
        model = Artist
        fields = ('id', 'name', 'bio', 'image_url', 'track_count')

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_track_count(self, obj):
        return obj.tracks.count()


class AlbumListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for album lists (no nested tracks)."""
    artist_name = serializers.CharField(source='artist.name', read_only=True)
    cover_url = serializers.SerializerMethodField()
    track_count = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = ('id', 'title', 'artist_name', 'artist', 'cover_url', 'release_year', 'track_count')

    def get_cover_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None

    def get_track_count(self, obj):
        return obj.tracks.count()


class TrackSerializer(serializers.ModelSerializer):
    artist_name = serializers.CharField(source='artist.name', read_only=True)
    album_title = serializers.CharField(source='album.title', read_only=True, default=None)
    album_cover_url = serializers.SerializerMethodField()
    audio_url = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Track
        fields = (
            'id', 'title', 'artist', 'artist_name',
            'album', 'album_title', 'album_cover_url',
            'audio_url', 'duration', 'track_number',
            'play_count', 'is_liked',
        )

    def get_album_cover_url(self, obj):
        request = self.context.get('request')
        if obj.album and obj.album.cover_image and request:
            return request.build_absolute_uri(obj.album.cover_image.url)
        return None

    def get_audio_url(self, obj):
        request = self.context.get('request')
        if obj.audio_file and request:
            return request.build_absolute_uri(obj.audio_file.url)
        return None

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.liked_tracks.filter(id=obj.id).exists()
        return False


class AlbumDetailSerializer(serializers.ModelSerializer):
    """Full album detail with nested tracks."""
    artist_name = serializers.CharField(source='artist.name', read_only=True)
    cover_url = serializers.SerializerMethodField()
    tracks = TrackSerializer(many=True, read_only=True)

    class Meta:
        model = Album
        fields = ('id', 'title', 'artist', 'artist_name', 'cover_url', 'release_year', 'tracks')

    def get_cover_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image and request:
            return request.build_absolute_uri(obj.cover_image.url)
        return None