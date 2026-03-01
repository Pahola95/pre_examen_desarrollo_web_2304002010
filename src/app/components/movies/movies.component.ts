import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
})
export class MoviesComponent implements OnInit {
  movies: any[] = [];
  loading = true;
  error = '';
  showRatingModal = false;
  selectedMovieId: number | null = null;
  selectedMovieTitle = '';
  userRating = 0;
  ratingLoading = false;
  ratingError = '';

  constructor(
    private moviesService: MoviesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies(page: number = 1): void {
    this.loading = true;
    this.error = '';
    this.moviesService.getMovies(page).subscribe({
      next: (res) => {
        this.movies = res?.results ?? [];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'No se pudieron cargar las películas.';
        this.loading = false;
        console.log('error',error)
      },
    });
  }

  openRatingModal(movieId: number, movieTitle: string): void {
    this.selectedMovieId = movieId;
    this.selectedMovieTitle = movieTitle;
    this.userRating = 0;
    this.ratingError = '';
    this.showRatingModal = true;
  }

  closeRatingModal(): void {
    this.showRatingModal = false;
    this.selectedMovieId = null;
    this.userRating = 0;
  }

  submitRating(): void {
    if (!this.selectedMovieId || this.userRating === 0) {
      this.ratingError = 'Por favor selecciona una calificación.';
      return;
    }

    this.ratingLoading = true;
    this.ratingError = '';

    this.moviesService.rateMovie(this.selectedMovieId, this.userRating).subscribe({
      next: (resp) => {
        console.log(resp)
        this.ratingLoading = false;
        this.closeRatingModal();
        alert('¡Película calificada exitosamente!');
      },
      error: (error) => {
        this.ratingLoading = false;
        
        // If token expired, refresh and retry
        if (error.status === 401) {
          this.authService.refreshAccessToken().subscribe({
            next: () => {
              this.submitRating();
            },
            error: () => {
              this.ratingError = 'Error de autenticación. Por favor, inicia sesión de nuevo.';
            },
          });
        } else {
          this.ratingError = 'Error al calificar la película. Intenta de nuevo.';
        }
      },
    });
  }

  setRating(rating: number): void {
    this.userRating = rating;
  }
}