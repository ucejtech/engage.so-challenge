const getFromStorage = () => {
  return JSON.parse(localStorage.getItem('notes'))
}

const setToStorage = notes => {
  localStorage.setItem('notes', JSON.stringify(notes))
}

export { getFromStorage, setToStorage }
