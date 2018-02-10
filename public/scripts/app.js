$(document).ready(function () {

  // $('#create-card-section').on('click', function (event) {
  console.log('RELOADSADASDADADASDASDADADA-page')
  // })
  // $.post("/car)ds", (newCard) => {
  //   let templateVars = { };
  // })
$("#create-new-card-submit").on('click', function (event) {
  $('.card').remove();
  setTimeout(function() {
    window.location.replace("/user-boards")
}, 2000); 
})

  $("#register-button").click(function () {
    $(".register-form").slideToggle("slow");
  });

  $("#login-button").click(function () {
    $(".login-form").slideToggle("slow");
  });

  $("#reveal-new-card").click(function () {
    $("#create-card-section").slideToggle("slow");
  });

  $("#comment-box-open").click(function () {
    $("#comment-box").slideToggle("slow");
  });

  $(".comments-display").click(function () {
     console.log('clicked comments display!');
     let cardid = $(this).data('cardid');
     console.log(cardid);
    $("#"+cardid).slideToggle("slow");
  });

  $("#logout-button").on('click', function () {
    console.log("logout clicked")
    $.post("/logout", () => {
      console.log("logged out");
      //This redirects the window back to the home page
      window.location.replace("/");
    })
  })
  ///////// NEW BOARD ADD.... SUBMIT //////////
  $("#add-board-button").on('click', function (event) {
    event.preventDefault();
    const newBoardName = $('#new-board').val();
    console.log("newBoardName", newBoardName)
    postNewBoard(newBoardName)
  })

  function postNewBoard(postNewBoardName) {

    $.ajax({
      url: `/user/boards`,
      method: 'POST',
      data: {
        name: postNewBoardName
      },
      success: function () {
        console.log("ajax", postNewBoardName)
        $('#new-board').val("")
        setTimeout(window.location = ".", 600)
      }
    })
  }

  ///////// NEW CARDS SUBMIT //////////
  $('#new-card').on('submit', function (event) {
    event.preventDefault();
    //const formDataStr = $(this).serialize()
    const cardTitle = $(this).find('#validationDefault01').val();
    const boardID = $('option:selected', this).val();
    const boardName = $('option:selected', this).text();
    const newCardULR = $(this).find('#validationDefault02').val();
    const newCardtags = $(this).find('#validationDefault03').val();
    console.log("newCardULR:", newCardULR, "boardID:", boardID, "newCardtags:", newCardtags, "cardTitle:", cardTitle, "boardName:", boardName)
    // ????  is the this all the above info????
    postCards($(this).serialize())

  });

  function postCards(formDataStr) {
    $.ajax({
      url: `/cards`,
      method: 'POST',
      data: formDataStr,
      success: function () {
        $(this).find('#validationDefault01').val(""); //clear  cardTitle
        //$('option:selected',this).val(); //no need to clear selected wheel
        $(this).find('#validationDefault02').val(""); //clear   newCardULR
        $(this).find('#validationDefault03').val(""); // clear  newCardtags
        getCards()
      }
    })
  }

  function getCards() {
    $.ajax({
      url: `/cards`,
      method: 'GET',
      success: function (data) {
        console.log(data)
        renderCard(data);
      }
    });
  }

  function renderCard(cards) {
    const cardBoard = $('.card-container');
    cardBoard.empty()
    //prepend to render ontop of old tweets....append would be for bottom
    for (let card in cards) {
      cardBoard.prepend(createCardElement(cards[cards]));
    }
  }

  function escape(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function createCardElement(cardObj) {
    $card = $("<article>").addClass("card");
    //do get request to get userId

    let cardInfo = `
    <div class="card" style="width: 18rem;">
    <h5><a  class="card-title" href=${escape(cardObj.user.card.url)}>${escape(cardObj.user.card.title)}</a></h5>
    <img class="card-img-top" src=${img} >
    <div class="card-body">
    <p class="card-tags">${escape(cardObj.user.card.tags)}</p>
    </div>
    <span class="user-name"> Saved by <b> ${cardObj.user.username}</b></span>
    <actions class="card-reaction">
    <i class="fa fa-heart" aria-hidden="true" type="submit"> </i>
    <span class="likes-value"> ${cardObj.user.card.likes} </span>
    </actions>
    </div>
    `;
    $card = $card.append(cardInfo);
    return $card;
  }

  $('#show-my-cards').on('click', function (event) {
    $('.card').remove();
    window.location.replace("/user-boards");
  })

  $('.fa-heart').on('click', function(event) {
    event.preventDefault();
    let data = {cardid: $(this).data('cardid')}

    $.post('/like-card', data, () => {
      //have to re-render the card!
    })
    console.log('cliked like!')
  })
})
