/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { listMovies, ListMoviesData, OrderDirection } from "@movie/dataconnect";
import { getMovieById, GetMovieByIdData } from "@movie/dataconnect";
import { GetActorByIdData, getActorById } from "@movie/dataconnect";

import { upsertUser } from "@movie/dataconnect";
import { getCurrentUser, GetCurrentUserData } from "@movie/dataconnect";

import {
  addFavoritedMovie,
  deleteFavoritedMovie,
  getIfFavoritedMovie,
} from "@movie/dataconnect";
import { addReview, deleteReview } from "@movie/dataconnect";

import { searchAll, SearchAllData } from "@movie/dataconnect";

import {
  searchMovieDescriptionUsingL2similarity,
  SearchMovieDescriptionUsingL2similarityData,
} from "@movie/dataconnect";

import { onAuthStateChanged, User } from "firebase/auth";

// Fetch top-rated movies
export const handleGetTopMovies = async (
  limit: number
): Promise<ListMoviesData["movies"] | null> => {
  try {
    const response = await listMovies({
      orderByRating: OrderDirection.DESC,
      limit: limit,
    });
    return response.data.movies;
  } catch (error) {
    console.error("Error fetching top movies", error);
    return null;
  }
};

// Fetch latest movies
export const handleGetLatestMovies = async (
  limit: number
): Promise<ListMoviesData["movies"] | null> => {
  try {
    const response = await listMovies({
      orderByReleaseYear: OrderDirection.DESC,
      limit: limit,
    });
    return response.data.movies;
  } catch (error) {
    console.error("Error fetching top movies", error);
    return null;
  }
};

// Fetch movie details by ID
export const handleGetMovieById = async (movieId: string) => {
  try {
    const response = await getMovieById({ id: movieId });
    if (response.data.movie) {
      return response.data.movie;
    }
    return null;
  } catch (error) {
    console.error("Error fetching movie by ID", error);
    return null;
  }
};


// Fetch actor details by ID
export const handleGetActorById = async (actorId: string) => {
  try {
    const response = await getActorById({ id: actorId });
    if (response.data.actor) {
      return response.data.actor;
    }
    return null;
  } catch (error) {
    console.error("Error fetching actor by ID", error);
    return null;
  }
};

// Updates user table when user signs in
export const handleAuthStateChange = (
  auth: any,
  setUser: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const username = user.email?.split("@")[0] || "anonymous";
      await upsertUser({ username });
    }
    setUser(user);
  });
};

// Fetch current user profile
export const handleGetCurrentUser = async (): Promise<
  GetCurrentUserData["user"] | null
> => {
  try {
    const response = await getCurrentUser();
    return response.data.user;
  } catch (error) {
    console.error("Error fetching current user", error);
    return null;
  }
};


// Add a movie to user's favorites
export const handleAddFavoritedMovie = async (
  movieId: string
): Promise<void> => {
  try {
    await addFavoritedMovie({ movieId });
  } catch (error) {
    console.error("Error adding favorited movie", error);
    throw error;
  }
};

// Remove a movie from user's favorites
export const handleDeleteFavoritedMovie = async (
  movieId: string
): Promise<void> => {
  try {
    await deleteFavoritedMovie({ movieId });
  } catch (error) {
    console.error("Error deleting favorited movie", error);
    throw error;
  }
};

// Check if the movie is favorited by the user
export const handleGetIfFavoritedMovie = async (
  movieId: string
): Promise<boolean> => {
  try {
    const response = await getIfFavoritedMovie({ movieId });
    return !!response.data.favorite_movie;
  } catch (error) {
    console.error("Error fetching if movie is favorited", error);
    return false;
  }
};

// Add a review to a movie
export const handleAddReview = async (
  movieId: string,
  rating: number,
  reviewText: string
): Promise<void> => {
  try {
    await addReview({ movieId, rating, reviewText });
  } catch (error) {
    console.error("Error adding review", error);
    throw error;
  }
};

// Delete a review from a movie
export const handleDeleteReview = async (movieId: string): Promise<void> => {
  try {
    await deleteReview({ movieId });
  } catch (error) {
    console.error("Error deleting review", error);
    throw error;
  }
};

// Function to perform the search using the query and filters
export const handleSearchAll = async (
  searchQuery: string,
  minYear: number,
  maxYear: number,
  minRating: number,
  maxRating: number,
  genre: string
): Promise<SearchAllData | null> => {
  try {
    const response = await searchAll({
      input: searchQuery,
      minYear,
      maxYear,
      minRating,
      maxRating,
      genre,
    });
    return response.data;
  } catch (error) {
    console.error("Error searching all", error);
    return null;
  }
};


// Perform vector-based search for movies based on description
export const searchMoviesByDescription = async (
  query: string
): Promise<
  | SearchMovieDescriptionUsingL2similarityData["movies_descriptionEmbedding_similarity"]
  | null
> => {
  try {
    const response = await searchMovieDescriptionUsingL2similarity({ query });
    return response.data.movies_descriptionEmbedding_similarity;
  } catch (error) {
    console.error("Error searching movies by description", error);
    return null;
  }
};

export const fetchSimilarMovies = async (
  description: string
): Promise<any[]> => {
  return [];
};
