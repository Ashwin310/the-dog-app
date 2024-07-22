import React, { useState, useEffect } from "react"
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import pino from "pino";
export default function Home() {

  const [dogs, setDogs] = useState([])
  const [text, setText] = useState("")
  const [searched, setSearched] = useState(false)
  const [pageCount, setpageCount] = useState(0);

  const logger = pino() 

  let limit = 9;

  useEffect(() => {
    const fetchDogData = async () => {
      try {
        const res = await fetch(`https://api.thedogapi.com/v1/breeds?page=0&limit=${limit}`)
        const data = await res.json();
        const total = res.headers.get("Pagination-Count");
        setpageCount(Math.ceil(total / limit))
        setDogs(data)
        logger.info(data)
      } catch (error) {
        logger.error(error)
      }
    }

    setSearched(false)
    fetchDogData()
  }, [limit])

  const searchForDog = async () => {
    try {
      const res = await fetch(
        `https://api.thedogapi.com/v1/breeds/search?q=${text}`
      )
      const data = await res.json()
      setDogs(data)
    } catch (error) {
      logger.error(error)
    }
  }

  const handleSubmit = (e) => {
      e.preventDefault()
      searchForDog()
      setSearched(true)  
  }

  const paginateDogs = async (currentPage) => {
    const res = await fetch(
      `https://api.thedogapi.com/v1/breeds?page=${currentPage}&limit=${limit}`
    );
    const data = await res.json();
    return data;
  };

  const handlePageClick = async (data) => {
    console.log(data.selected);

    let currentPage = data.selected;

    const dogsToPaginate = await paginateDogs(currentPage);
    logger.info(dogsToPaginate)
    setDogs(dogsToPaginate);
  };

  return (
    <>
      {!dogs ? (
        <h1 className="flex items-center justify-center text-gray-950 text-center px-5 text-3xl h-screen font-bold uppercase">
          Loading...
        </h1>
      ) : (
        <>
          <section className="p-8 max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="flex items-center justify-center text-center px-5 text-3xl font-bold lg:text-5xl text-gray-950 mb-10">
                The Dog World
              </h1>
              

              <form
                onSubmit={handleSubmit}
                className="max-w-xl mx-auto"
                autoComplete="off"
              >
                <input
                  type="text"
                  name="search"
                  id="search"
                  required
                  placeholder="Search your favourite dog"
                  className="py-2 px-4 rounded shadow w-full bg-slate-400 text-gray-50 placeholder-white"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </form>
            </div>

            

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 my-10 lg:my-20">
              {!searched ? (
                dogs.map((dog) => (
                  <Link
                    to={`/${dog.name}`}
                    key={dog.id}
                    className="bg-slate-700 p-4 rounded hover:bg-slate-600 transition-all duration-200"
                  >
                    <article>
                      <img
                        src={`https://cdn2.thedogapi.com/images/${dog.reference_image_id}.jpg`}
                        alt={dog.name}
                        loading="lazy"
                        className="rounded md:h-72 w-full object-cover"
                      />
                      <h3 className="text-white text-lg font-bold mt-4">
                        {dog.name}
                      </h3>
                      <p className="text-slate-400">Breed For: {dog.bred_for}</p>
                    </article>
                  </Link>
                ))
              ) : (
                <>
                  {dogs.map((dog) => (
                    <Link
                      to={`/${dog.name}`}
                      key={dog.id}
                      className="bg-slate-700 p-4 rounded hover:bg-slate-600 transition-all duration-200"
                    >
                      <article>
                        <img
                          src={`https://cdn2.thedogapi.com/images/${dog.reference_image_id}.jpg`}
                          alt={dog.name}
                          className="rounded md:h-72 w-full object-cover"
                        />
                        <h3 className="text-white text-lg font-bold mt-4">
                          {dog.name}
                        </h3>
                        <p className="text-slate-400">
                          Breed For: {dog.bred_for}
                        </p>
                      </article>
                    </Link>
                  ))}
                </>
              )}
            </div>
            <div className="">
            <ReactPaginate
              previousLabel={"<"}
              nextLabel={">"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={2}
              onPageChange={handlePageClick}
              containerClassName={"pagination justify-content-center"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
              // containerClassName={"flex items-center -space-x-px h-8 text-sm justify-center"}
              // pageClassName={"inline-flex -space-x-px text-sm"}
              // pageLinkClassName={"relative p-3 m-1 select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-gray-900 transition-all hover:bg-slate-600 hover:text-white focus:bg-slate-600 active:bg-slate-600 active:text-white focus:text-white disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"}
              // previousLinkClassName={"flex items-center gap-2 px-6 py-3 text-xs font-bold text-center text-gray-600 uppercase align-middle transition-all rounded-lg select-none hover:bg-slate-600 hover:text-white disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"}
              // nextLinkClassName={"flex items-center gap-2 px-6 py-3 text-xs font-bold text-center text-gray-600 uppercase align-middle transition-all rounded-lg select-none hover:bg-slate-600 hover:text-white disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"}
              // breakLinkClassName={"relative p-3 m-3 select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-gray-900 transition-all hover:bg-slate-600 hover:text-white  focus:bg-slate-600 active:bg-slate-600 active: text-white disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"}
            />
            </div>
            
          </section>
        </>
      )}
    </>
  )
}
