$(() => {
  const API_URL = 'https://mycooltodoapp-2f8dc.firebaseio.com'
  let token = null
  let userId = null

  const addItemToTable = (item, id) => {
    const row = `<tr data-id="${id}">
      <td>${item.task}</td>
      <td>
        <button class="btn btn-success complete">Complete</button>
        <button class="btn btn-danger delete">Delete</button>
      </td>
    </tr>`

    $('tbody').append(row)
  }

  const getTasks = () => {
    $.get(`${API_URL}/${userId}/task.json?auth=${token}`)
      .done((data) => {
        if (data) {
          // for (id in data) {
          //   addItemToTable(data[id])
          // }

          Object.keys(data).forEach((id) => {
            addItemToTable(data[id], id)
          })
        }
      })
  }

  // CREATE: form submit event to POST data to firebase
  $('.new form').submit((e) => {
    // $.ajax({
    //   url: `${API_URL}.json`,
    //   method: 'POST',
    //   data: JSON.stringify({ task: 'I was posted!' })
    // })

    $.post(`${API_URL}/${userId}/task.json?auth=${token}`,
      JSON.stringify({ task: 'I was posted!' })
    )

    // TODO: Grab the form text
    // TODO: Make this not refresh the page
  })

  $('tbody').on('click', '.delete', (e) => {
    const row =  $(e.target).closest('tr')
    const taskId = row.data('id')

    $.ajax({
      url: `${API_URL}/${userId}/task/${taskId}.json?auth=${token}`,
      method: 'DELETE'
    }).done(() => {
      row.remove()
    })
  })

  firebase.initializeApp({
   apiKey: "AIzaSyD7OHkXVKNz6h7uJXkN67n-VblLweEQ-wA",
    authDomain: "mycooltodoapp-2f8dc.firebaseapp.com",
    databaseURL: "https://mycooltodoapp-2f8dc.firebaseio.com",
    storageBucket: "mycooltodoapp-2f8dc.appspot.com",
  })

  // both return promise like objects
  const login = (email, password) => (
    firebase.auth()
      .signInWithEmailAndPassword(email, password)
  )

  const register = (user, password) => (
    firebase.auth().createUserWithEmailAndPassword(user, password)
  )

  $('.login form').submit((e) => {
    const form = $(e.target)
    const email = form.find('input[type="text"]').val()
    const password = form.find('input[type="password"]').val()

    login(email, password)
      .then(console.log)
      .catch(console.err)

    e.preventDefault()
  })

  $('input[value="Register"]').click((e) => {
    const form = $(e.target).closest('form')
    const email = form.find('input[type="text"]').val()
    const password = form.find('input[type="password"]').val()

    register(email, password)
      .then(() => login(email, password))
      .then(console.log)
      .catch(console.err)

    e.preventDefault()
  })

  $('.logout').click(() => {
    firebase.auth().signOut()
  })

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // logged in
      $('.login').hide()
      $('.app').show()

      $('.logged_in_user').text(user.email)

      userId = user.uid

      user.getToken()
        .then(t => token = t)
        .then(getTasks)

    } else {
      // logged out
      $('.app').hide()
      $('.login').show()
      $('tbody').empty()
    }
  })
})
