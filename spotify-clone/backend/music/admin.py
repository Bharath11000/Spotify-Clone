from django.contrib import admin
from .models import Artist, Album, Track


@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)


@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'release_year')
    list_filter = ('artist', 'release_year')
    search_fields = ('title', 'artist__name')


@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'album', 'duration', 'play_count')
    list_filter = ('artist', 'album')
    search_fields = ('title', 'artist__name')