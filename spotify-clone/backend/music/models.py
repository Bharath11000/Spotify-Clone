from django.db import models


class Artist(models.Model):
    name = models.CharField(max_length=200)
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to='covers/artists/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Album(models.Model):
    title = models.CharField(max_length=200)
    artist = models.ForeignKey(Artist, related_name='albums', on_delete=models.CASCADE)
    cover_image = models.ImageField(upload_to='covers/albums/', null=True, blank=True)
    release_year = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-release_year', 'title']

    def __str__(self):
        return f'{self.title} — {self.artist.name}'


class Track(models.Model):
    title = models.CharField(max_length=200)
    artist = models.ForeignKey(Artist, related_name='tracks', on_delete=models.CASCADE)
    album = models.ForeignKey(Album, related_name='tracks', on_delete=models.SET_NULL, null=True, blank=True)
    audio_file = models.FileField(upload_to='audio/')
    duration = models.PositiveIntegerField(default=0, help_text='Duration in seconds')
    track_number = models.PositiveIntegerField(default=1)
    play_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['album', 'track_number', 'title']

    def __str__(self):
        return f'{self.title} by {self.artist.name}'

    def increment_play_count(self):
        self.play_count += 1
        self.save(update_fields=['play_count'])