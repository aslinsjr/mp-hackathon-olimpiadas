import { useState, useEffect } from 'react'

import Header from './components/Header'
import FilterSearchComponent from './components/FilterSearchComponent'

import './App.css'

function App() {

  const [darkMode, setDarkMode] = useState(false)
  const [search, setSearch] = useState("")
  const [data, setData] = useState([])
  const [newData, setNewData] = useState([])
  const [filterArray, setFilterArray] = useState([])
  const [mobileSearch, setMobileSearch] = useState(false)

  async function getData() { // Função de Resgate de Dados de API
    try {
      for (let index = 1; index < 3; index++) {

        const response = await fetch(`https://apis.codante.io/olympic-games/countries`)

        const orders = await response.json()

        setData(orders.data)

      }

    } catch (error) {
      console.log(error)
    }
  }

  function handleMode(e) { // Função de Modo Light/Dark
    if (e.target.className.includes("fill")) {
      setDarkMode(false)

    } else {
      setDarkMode(true)

    }
  }

  function handleScroll() { // Função de Rolagem para o Topo
    window.scrollTo(0, 100)
  }

  function handleSearch(e) { // Função de Busca
    setSearch(e.target.value.toLowerCase().replace(/(?:^|\s)(?!da|de|do)\S/g, l => l.toUpperCase()))
  }

  function handleClean() { // Função de Reset de Busca
    const input = document.querySelector("input")

    input.value = ""

    setSearch("")
  }

  function handleFilter(e) { // Função de Filtro
    const region = e.target.value

    const filterRegionArray = data.filter((nation) => {
      return nation.continent.includes(region)
    })

    setFilterArray(filterRegionArray)
    window.scrollTo(0, 100)
  }

  function handleMobile() { // Função Menu de Busca Mobile

    if(mobileSearch) {
      setMobileSearch(false)
    } else {
      setMobileSearch(true)
    }
  }

  useEffect(() => { // Controle de Requisição
    getData()
  }, [])

  useEffect(() => { // Controle de Database
    setNewData(data)
  }, [data])

  useEffect(() => { // Controle de Função de Busca
    const newArray = data.filter((nation) => {
      return nation.name.includes(search)
    })

    if (newArray.length > 1) {

      setNewData(newArray)
      window.scrollTo(0, 100)

    }

  }, [search])

  useEffect(() => { // Controle de Exibição de Filtro de Busca
    if (filterArray.length == 0) {

      setNewData(data)

    } else {

      setNewData(filterArray)
      
    }
  }, [filterArray])

  return (
    <div className={darkMode ? "app-container dark" : "app-container"}>
      <Header mobileSearch={mobileSearch} handleMode={handleMode} darkMode={darkMode} handleMobile={handleMobile} />
      <div className="inner-app">
        <div className="inner-header">
          <FilterSearchComponent mobileSearch={mobileSearch} handleClean={handleClean} handleSearch={handleSearch} handleFilter={handleFilter} darkMode={darkMode} />
          <h1 style={darkMode ? { backgroundColor: "var(--dark-blue)", boxShadow: "1px 1px 0.3rem 1px var(--white)" } : {}}>
            Quadro de Medalhas <span style={darkMode ? { color: 'var(--dark-blue)' } : {}}>Top 50</span>
          </h1>
        </div>
        <div className='countries-container'>
          {newData.map((nation) => {
            return (
              <div className={darkMode ? 'countrie-box dark-box' : 'countrie-box'} key={nation.id} id={nation.name}>
                <img className='flag-img' src={nation.flag_url} alt={nation.name + " Flag"} />
                <h2 className='countrie-name'>{nation.name}</h2>
                <p className='medals'>Medalhas de Ouro: <span>{nation.gold_medals}🥇</span></p>
                <p className='medals'>Medalhas de Prata: <span>{nation.silver_medals}🥈</span></p>
                <p className='medals'>Medalhas de Bronze: <span>{nation.bronze_medals}🥉</span></p>
                <p id='nation-rank' style={darkMode ? { color: "var(--dark-blue)" } : {}}>{`${nation.rank}° lugar`}</p>
              </div>)
          })}
        </div>
      </div>
      <button id='scroll-btn' onClick={() => handleScroll()} style={darkMode ? { backgroundColor: 'var(--dark-blue)', boxShadow: "1px 1px 0.3rem 1px var(--white)" } : {}}><i className="bi bi-arrow-up" style={darkMode ? { color: 'var(--white)' } : {}}></i></button>
    </div>
  )
}

export default App
