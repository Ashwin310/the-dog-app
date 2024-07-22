import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import pino from "pino";

export default function SingleDog() {
  const [dog, setDog] = useState([])
  const { name } = useParams()
  const logger = pino() 

  useEffect(() => {
    const fetchSingleDogData = async () => {
      try {
        const res = await fetch(
          `https://api.thedogapi.com/v1/breeds/search?q=${name}`
        )
        const data = await res.json()
        setDog(data)
        logger.log(data)
      } catch (error) {
        logger.error(error)
      }
    }

    fetchSingleDogData()
  }, [name])

  return (
    <>
      <section className="max-w-5xl mx-auto flex items-center justify-center h-screen">
        {dog.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 gap-8 p-8 md:grid-cols-2 md:place-items-center"
          >
            <article>
              <img
                src={`https://cdn2.thedogapi.com/images/${item.reference_image_id}.jpg`}
                alt={item.name}
              />
            </article>
            <article>
              <h1 className="text-3xl font-bold text-gray-950 mb-8 lg:text-5xl">
                {item.name}
              </h1>
              {item.description && (
                <p className="text-gray-950 mb-8 text-sm lg:text-base leading-loose lg:leading-relaxed">
                  {item.description}
                </p>
              )}

              <ul className="text-sm text-gray-950 leading-loose lg:text-base lg:leading-relaxed">
                <li>
                  <span className="font-bold text-gray-950">Bred For:</span>{" "}
                  {item.bred_for}
                </li>
                <li>
                  <span className="font-bold text-gray-950">Height:</span>{" "}
                  {item.height.metric} cm
                </li>
                <li>
                  <span className="font-bold text-gray-950">Weight:</span>{" "}
                  {item.weight.metric} kgs
                </li>
                <li>
                  <span className="font-bold text-gray-950">Breed Group:</span>{" "}
                  {item.breed_group}
                </li>
                <li>
                  <span className="font-bold text-gray-950">Lifespan:</span>{" "}
                  {item.life_span}
                </li>
                <li>
                  <span className="font-bold text-gray-950">Temperament:</span>{" "}
                  {item.temperament}
                </li>
              </ul>

              <Link
                to="/"
                className="inline-block bg-slate-600  py-2 px-6 rounded mt-8 text-white hover:bg-slate-500 transition-all duration-200"
              >
                &larr; Back
              </Link>
            </article>
          </div>
        ))}
      </section>
    </>
  )
}
