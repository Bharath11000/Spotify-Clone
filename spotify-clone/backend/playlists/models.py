from django.conf import settings
from django.db import models


class Playlist(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='playlists',
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='covers/playlists/', null=True, blank=True)
    is_public = models.BooleanField(default=True)
    tracks = models.ManyToManyField(
        'music.Track',
        through='PlaylistTrack',
        related_name='playlists',
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f'{self.name} ({self.owner.username})'


class PlaylistTrack(models.Model):
    """Through model for ordered tracks in a playlist."""
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    track = models.ForeignKey('music.Track', on_delete=models.CASCADE)
    position = models.PositiveIntegerField(default=0)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['position', 'added_at']
        unique_together = ('playlist', 'track')

    def __str__(self):
        return f'{self.playlist.name} — {self.track.title}'