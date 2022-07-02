import crud from './config/crud';
import './App.css';
import { useEffect, useState, useCallback } from 'react';

function App() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [filterData, setFilterData] = useState("");
  const [lastName, setLastName] = useState("");
  const [listUsers, setListUsers] = useState([]);

  const searchUser = useCallback(() => {
    const filters = [];

    const filterName = {
      property: "name",
      operator: ">=",
      value: filterData
    };

    filters.push(filterName)

    crud.get("users", filters)
      .then(listUser => {
        console.log(listUser);
        setListUsers(listUser);
      })
  }, [filterData]);

  const addRegister = () => {
    const saveData = mountUser();

    crud.save("users", saveData)
      .then(user => {
        console.log('USER: ', user)
      })
      .catch(console.error);
    searchUser();
  }

  const changeRegister = () => {
    crud.save("users", mountUser(), id)
      .then(user => {
        console.log('USER: ', user);
      })
      .catch(console.error);
    searchUser();
  }

  const deleteRegister = (id) => {
    crud.delete("users", id)
      .then(user => {
        console.log('USER: ', user);
      })
      .catch(console.error);
    searchUser();
  }

  const mountUser = () => {
    return { name, lastName };
  }

  useEffect(() => {
    searchUser();
  }, [filterData, searchUser]);

  return (
    <div className="App">
      Id:<input value={id} onChange={e => setId(e.target.value)} /> <br />
      Nome:<input value={name} onChange={e => setName(e.target.value)} /><br />
      Sobrenome:<input value={lastName} onChange={e => setLastName(e.target.value)} /><br />
      <button onClick={addRegister}> Registrar </button>
      <button onClick={changeRegister}> Alterar </button> <br /> <br />
      Filter: <input value={filterData} onChange={e => setFilterData(e.target.value)} /><br />

      {
        listUsers.map((user, index) => <div key={index}> <h6 style={{display: 'inline', margin: 15}}> {JSON.stringify(user.name)}</h6>
          {JSON.stringify(user.id)} <button onClick={() => deleteRegister(user.id)}>X</button>
          <button onClick={() => setId(user.id)}> E </button>
        </div>)
      }

    </div>
  );
}

export default App;
