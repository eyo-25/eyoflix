export function makeImagePath(id:string, format?:string){
    return id === null ? (
      `https://netflix-gw.netlify.app/static/media/noPoster.8a5ba7e5.png`) : (
      `https://image.tmdb.org/t/p/${format? format:"original"}/${id}`)
}