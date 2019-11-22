document.addEventListener('DOMContentLoaded', function () {
  const dancerURL = 'http://localhost:3000/dancers/';
  const feedbackURL = 'http://localhost:3000/feedback/';
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  let dancerId = 1;

  function getDancer(id) {
    return fetch(dancerURL + id);
  }

  // I can see an image of a dancer
  function updateImage(url) {
    document.querySelector('#dance-image').style.backgroundImage = `url("${url}")`;
  }

  // I can see a description of the dance
  function updateDescription(description) {
    document.querySelector('.description p').textContent = description;
  }

  // I can see existing feedback below the feedback form, each in its own paragraph
  function addSingleFeedback(feedback) {
    const para = document.createElement('p');

    para.textContent = feedback;
    document.querySelector('#feedback-container').appendChild(para);
  }

  function addMultipleFeedback(array) {
    array.forEach(function(fbObject) {
      addSingleFeedback(fbObject.content);
    });
  }

  // put all of that stuff up there together
  function getAndUpdate(id) {
    getDancer(id)
      .then(res => res.json())
      .then(json => {
        updateImage(json.url);
        updateDescription(json.description);
        addMultipleFeedback(json.feedback);
      })
      .catch(console.log);
  }

  getAndUpdate(dancerId);


  // I can add feedback via the form and see it on the webpage
  function addFeedbackFromForm() {
    const input = document.querySelector('#feedback');

    addSingleFeedback(input.value);
    input.value = '';
  }

  document.querySelector('input[type=submit]').addEventListener('click', function(e) {
    e.preventDefault();
    persistFeedback(); // BONUS
    addFeedbackFromForm();
  });


  // BONUS: I can persist my feedback to the database so it shows up if I reload the page with the same dancer
  function postFeedbackRequest(body) {
    return fetch(feedbackURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ feedback: body })
    });
  }

  function persistFeedback() {
    const input = document.querySelector('#feedback');

    postFeedbackRequest({
      content: input.value,
      dancer_id: dancerId
    });
  }

  // BONUS: I can load the next dancer and see their image, description and feedback
  function clearFeedback() {
    document.querySelector('#feedback-container').textContent = '';
  }

  document.querySelector('#bonus').addEventListener('click', function(e) {
    dancerId++;
    clearFeedback();
    getAndUpdate(dancerId);
  });

});