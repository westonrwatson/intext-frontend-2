class LikedMovies {
    static async checkIfLiked(show_id: string): Promise<boolean> {
        const likedMoviesJSON = localStorage.getItem('likedMovies');
        if (likedMoviesJSON) {
            const likedMovies = JSON.parse(likedMoviesJSON);
            return likedMovies.some((movie: string) => movie === show_id);
        } else {
            return false;
        }
    };

    static async addToLikedMovies(show_id: string): Promise<void> {
        const likedMoviesJSON = localStorage.getItem('likedMovies');
        let likedMovies: string[] = [];
        if (likedMoviesJSON) {
            likedMovies = JSON.parse(likedMoviesJSON);
        };
        if (!likedMovies.includes(show_id)) {
            likedMovies.push(show_id);
            localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
        };
    };

    static async removeFromLikedMovies(show_id: string): Promise<void> {
        const likedMoviesJSON = localStorage.getItem('likedMovies');
        if (likedMoviesJSON) {
            const likedMovies = JSON.parse(likedMoviesJSON);
            const newLikedMovies = likedMovies.filter((movie: string) => movie !== show_id);
            localStorage.setItem('likedMovies', JSON.stringify(newLikedMovies));
        };
    };
};

export default LikedMovies;