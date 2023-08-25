'use strict'

const table = document.querySelector('table')
const pages = document.querySelector('.pagination')

let offset = 0
let filter = 'fname'
let toggle = true

async function getData(offsetF, filterF) {
  let data
  if (!sessionStorage.getItem('table')) {
    const url = 'http://www.filltext.com/?rows=1000&fname=%7BfirstName%7D&lname=%7BlastName%7D&tel=%7Bphone%7Cformat%7D&address=%7BstreetAddress%7D&city=%7Bcity%7D&state=%7BusState%7Cabbr%7D&zip=%7Bzip%7D&pretty=true'
    const res = await fetch(url)
    data = await res.json()
    sessionStorage.setItem('table', JSON.stringify(data))
  } else data = JSON.parse(sessionStorage.getItem('table'))
  
  const page = data.sort((a,b) => (toggle ? String(a[filterF]).localeCompare(String(b[filterF])) :
  String(b[filterF]).localeCompare(String(a[filterF])))).filter((_,i) => i >= offsetF && i < offsetF + 50)
  offset = offsetF
  filter = filterF
  table.innerHTML = ''
  pages.innerHTML = ''

  table.insertAdjacentHTML('beforeend',` 
  <tr>
    ${Object.keys(data[1]).map(e => {
      if (e === filterF && toggle) {
        return `<th class="filter"> <div> <span>${e}</span> <span class="material-symbols-outlined">expand_less</span> </div> </th>`
      } else if((e === filterF && !toggle)) {
        return `<th class="filter"> <div> <span>${e}</span> <span class="material-symbols-outlined">expand_more</span> </div> </th>`
      } else return `<th> <div> <span>${e}</span> </div> </th>`
    }).join('')}
  </tr>
  ${page.map(e => {
    return `
    <tr>
      <td>${e.fname}</td>
      <td>${e.lname}</td>
      <td>${e.tel}</td>
      <td>${e.address}</td>
      <td>${e.city}</td>
      <td>${e.state}</td>
      <td>${e.zip}</td>
    </tr>`
  }).join('')}`)
  pages.insertAdjacentHTML('beforeend', getPages(data).map(e => {
    return `<button ${e * 50 - 50 === offsetF ? 'class="active"' : ''}>${e}</button>`
  }).join(''))

}
getData(offset, filter)

function getPages(arr) {
  let total =  Math.ceil(arr.length / 50)
  let pages = [] 
  for (let i = 0; i < total; i++) {
    pages = [...pages, i + 1]
  } return pages
}

pages.addEventListener('click', e => {
  e.target.tagName === 'BUTTON' ? getData(e.target.textContent * 50 - 50, filter) : ''
})

table.addEventListener('click', e => {
  if (e.target.closest('TH')) {
    if (e.target.closest('div').children[0].textContent === filter) toggle = !toggle
    getData(offset, e.target.closest('div').children[0].textContent)
  }
})