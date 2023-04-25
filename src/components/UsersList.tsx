import { SortBy, type User } from '../types.d'

interface Props {
  changeSorting: (sorty: SortBy) => void
  deleteUser: (uuid: string) => void
  showColor: boolean
  users: User[]
}
export function UsersList ({ changeSorting, deleteUser, users, showColor }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Photo</th>
          <th className='pointer' onClick={() => { changeSorting(SortBy.NAME) }}>Name</th>
          <th className='pointer' onClick={() => { changeSorting(SortBy.LAST) }}>LastName</th>
          <th className='pointer' onClick={() => { changeSorting(SortBy.COUNTRY) }}>Country</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => {
          const backgroudColorRow = index % 2 === 0 ? '#333' : '#555'
          const changeColor = showColor ? backgroudColorRow : 'transparent'

          return (
            <tr key={user.login.uuid} style= {{ backgroundColor: changeColor }}>
              <td>
                <img src={user.picture.thumbnail} />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => {
                  deleteUser(user.login.uuid)
                }}>Delete</button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
