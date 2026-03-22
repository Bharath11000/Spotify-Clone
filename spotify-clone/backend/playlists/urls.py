from django.urls import path
from .views import (
    PlaylistListCreateView, PlaylistDetailView,
    AddTrackToPlaylistView, RemoveTrackFromPlaylistView,
)

urlpatterns = [
    path('', PlaylistListCreateView.as_view(), name='playlist-list-create'),
    path('<int:pk>/', PlaylistDetailView.as_view(), name='playlist-detail'),
    path('<int:pk>/tracks/', AddTrackToPlaylistView.as_view(), name='playlist-add-track'),
    path('<int:pk>/tracks/<int:track_id>/', RemoveTrackFromPlaylistView.as_view(), name='playlist-remove-track'),
]