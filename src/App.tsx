import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
import { UsersList } from './components/UsersList'

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [showColor, setShowColor] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFiltercountry] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const originalUsers = useRef<User[]>([])
  const toggleColors = () => {
    setShowColor(!showColor)
  }
  const toggleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE || sorting !== SortBy.COUNTRY ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
    // this solution is to sort by country setSortByCountry(prevState => !prevState)
  }

  const handleDelete = (uuid: string) => {
    const filterUsers = users.filter((user) => user.login.uuid !== uuid)
    setUsers(filterUsers)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleChangeSort = (sort: SortBy) => {
    const newValue = sort === sorting ? SortBy.NONE : sort
    setSorting(newValue)
  }
  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(`https://randomuser.me/api?results=10&&seed=or&page=${currentPage}`)
      .then(async res => {
        if (!res.ok) throw new Error('request error')
        return await res.json()
      })
      .then(res => {
        // this is correct if we need a number of users setUsers(res.results)
        setUsers(prevUsers => {
          const newUsers = prevUsers.concat(res.results)
          originalUsers.current = newUsers
          return newUsers
        })
      })
      .catch(err => {
        setError(err)
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [currentPage])

  const filterdUsers = useMemo(() => {
    return filterCountry !== null && filterCountry.length > 0
      ? users.filter(user => {
        return user.location.country.toLowerCase().includes(filterCountry.toLowerCase())
      })
      : users
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filterdUsers

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last
    }
    // Sort muta el array original al hacerlo con el users, toSorted is the methods more ideal
    return [...filterdUsers].sort((a, b) => {
      const extractoProperty = compareProperties[sorting]
      return extractoProperty(a).localeCompare(extractoProperty(b))
    })
  }, [filterdUsers, sorting])

  return (
    <div className="App">
      <h1>Prueba técnica</h1>
        <header>
          <button onClick={toggleColors}>
            Change Color
          </button>
          <button onClick={toggleSortByCountry}>
            Sort by country
          </button>
          <button onClick={handleReset}>
            Users Reset
          </button>
          <input placeholder='Search country' onChange={(e) => {
            setFiltercountry(e.target.value)
          }}/>
        </header>
        <main>
          {users.length > 0 && <UsersList changeSorting={handleChangeSort}
          deleteUser={handleDelete} users={sortedUsers} showColor={showColor}/>
          }
          {loading && <p>loading.....</p>}
          {!loading && error && <p>An error has occurred</p>}
          {!loading && !error && users.length === 0 && <p>There is not data</p>}
          {!loading && !error &&
            <button onClick={() => { setCurrentPage(currentPage + 1) }}>More</button>
          }
        </main>
    </div>
  )
}

export default App
