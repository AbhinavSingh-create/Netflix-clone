const APIKey='b5bfeb3258c4d120995357d417337e1f';
const apiUrl = 'https://api.themoviedb.org/3';

const apiGENRES='https://api.themoviedb.org/3/genre/movie/list?api_key=b5bfeb3258c4d120995357d417337e1f'
const imgPath='https://image.tmdb.org/t/p/original';
const YapiKey='AIzaSyD1sJ1fKvCMNFB77wYq4s1lBjffP9SLwKI'
const apiPaths={
  fetchAllCategories:`${apiUrl}/genre/movie/list?api_key=${APIKey}`,
  fetchMovieList:(id)=>`${apiUrl}/discover/movie?api_key=${APIKey}&with_genres=${id}`,
  fetchTrendList:`${apiUrl}/trending/movie/week?api_key=${APIKey}`,
  searchOnYoutube:(query)=>`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${YapiKey}`
}

function init(){
  //fetch(apiPaths.fetchAllCategories)
  //.then(response=>response.json())
  //.then(response=>console.table(response.genres))
  //.catch(err=>console.error(err));
  //fetchAndBuildMovieSection(apiPaths.fetchTrendList,'Trending Now')
  
  fetchTrendingMovie();

  getGenres();
}

function fetchTrendingMovie(){
  fetchAndBuildMovieSection(apiPaths.fetchTrendList,'Trending Now')
  .then(list=>{
    //console.log(list[0])
  const randomIndex=parseInt(Math.random()*list.length)
  buildDisplaySection(list[randomIndex])
    
  })
}
function buildDisplaySection(movie){
  const bannerCont=document.querySelector('.bannerSection');
   bannerCont.style.backgroundImage=`url('${imgPath}${movie.poster_path}')`;
   console.log(bannerCont)
   const div=document.createElement('div');
   div.innerHTML=`
   <div class="bannerContent">
        <h2 class="movieTitle">${movie.original_title}</h2>
        <div class="description">${movie.overview}
        </div>
        <div class="buttons">
          <button class="play">Play Now</button>
          <button class="info">More Info!</button>
        </div>
        <div class="colorFade"></div>
      </div>
   `
   bannerCont.appendChild(div);
}
async function getGenres(){
  fetch(apiPaths.fetchAllCategories)
.then(response=>response.json())
.then(response=>{
  const categories=response.genres;
  categories.forEach(category=>{
    fetchAndBuildMovieSection(apiPaths.fetchMovieList(category.id),category.name);
  });
})

}
function fetchAndBuildMovieSection(fetchURL,categoryName){
  //console.table(fetchUrl,category)
  return fetch(fetchURL)
  .then(response=>response.json())
  .then(response=>{
    //const movieLists=response.results
    const movieList=response.results;

    
    buildingMovieSection(movieList,categoryName)
    return movieList;
})
}
function buildingMovieSection(list,categoryName){
    const movieCont=document.querySelector('.movies-container')
    
    const posterHTML=list.map(item=>{
      return `
    <img class="movieCard" src=${imgPath}${item.poster_path} onclick="searchMovieTrailer('${item.title}')">
    
    `;
    })
    
    const movieSectionHTML=`
        <h2 class="moviesSectionHeading">
          ${categoryName}
        </h2>
        ${posterHTML}
    `

    const div=document.createElement('div');
    div.className='moviesSection'
    div.innerHTML=movieSectionHTML;

    //append html into movie-container
    movieCont.append(div);
  }
function searchMovieTrailer(movieName){
  fetch(apiPaths.searchOnYoutube(movieName))
  .then(response=>response.json())
  .then(response=>{
    const bestResult=response.items[0];
    const youtubeUrl=`https://www.youtube.com/watch?v=${bestResult.id.videoId}`
    window.open(youtubeUrl,'_blank')
  })
}

window.addEventListener('load',function(){
  init();
})

