# from django.urls import path
# from .views import (
#     ArtistListView, ArtistDetailView,
#     AlbumListView, AlbumDetailView,
#     TrackListView, TrackDetailView,
#     IncrementPlayCountView, LikeTrackView, LikedTracksView,
#     SearchView,
# )

# urlpatterns = [
#     # Artists
#     path('artists/', ArtistListView.as_view(), name='artist-list'),
#     path('artists/<int:pk>/', ArtistDetailView.as_view(), name='artist-detail'),
#     # Albums
#     path('albums/', AlbumListView.as_view(), name='album-list'),
#     path('albums/<int:pk>/', AlbumDetailView.as_view(), name='album-detail'),
#     # Tracks
#     path('tracks/', TrackListView.as_view(), name='track-list'),
#     path('tracks/<int:pk>/', TrackDetailView.as_view(), name='track-detail'),
#     path('tracks/<int:pk>/play/', IncrementPlayCountView.as_view(), name='track-play'),
#     path('tracks/<int:pk>/like/', LikeTrackView.as_view(), name='track-like'),
#     # Liked tracks
#     path('liked/', LikedTracksView.as_view(), name='liked-tracks'),
#     # Search
#     path('search/', SearchView.as_view(), name='search'),
# ]


from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, LogoutView, ProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
]