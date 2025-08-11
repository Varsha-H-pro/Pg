const CorosalPropertyImage=({state})=>{
  const s=state
  return(
      <div className="carrousel mt-6 bg-slate-200 w-full h-[500px] mb-10">
      <div className="carousel w-full">
        {s && s.cards.property_photos.map((img,idx)=>{
          return(
            idx==0?(<div id={"slide"+(idx)} className="carousel-item relative w-full">
            <img src={img.secure_url} className="w-1/2" />
            <div className="absolute flex gap-96 transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href={"#slide"+(s.cards.property_photos.length-1)} className="btn btn-circle">❮</a> 
              <a href={"#slide"+(idx+1)} className="btn btn-circle">❯</a>
            </div>
          </div> ):idx==(s.cards.property_photos.length-1)?
          (<div id={"slide"+(s.cards.property_photos.length-1)} className="carousel-item relative w-full">
            <img src={img.secure_url} className="w-1/2" />
            <div className="absolute flex gap-96 transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href={"#slide"+(s.cards.property_photos.length-2)} className="btn btn-circle">❮</a> 
              <a href={"#slide"+0} className="btn btn-circle">❯</a>
            </div>
          </div>):(<div id={"slide"+idx} className="carousel-item relative w-full">
  <img src={img.secure_url} className="w-1/2" />
  <div className="absolute flex gap-96 transform -translate-y-1/2 left-5 right-5 top-1/2">
    <a href={"#slide"+(idx-1)} className="btn btn-circle">❮</a> 
    <a href={"#slide"+(idx+1)} className="btn btn-circle">❯</a>
  </div>
</div>)
          )
        })}


</div>
      </div>
  )
}
export default CorosalPropertyImage