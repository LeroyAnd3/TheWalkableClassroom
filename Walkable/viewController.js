function renderView() {
  // console.log(data.decks);
  switch (data.view) {
    case 0:
      renderStartScreen();
      break;
    case 1:
      renderDeckCollection();
      break;
    case 2:
      renderCardCatalogue();
      break;
    case 3:
      renderCardMaker();
      break;
    case 4:
      renderGameView();
      break;
    case 5:
      renderInstructionsPage();
      break;
    // case 6:
    //   renderLeaderBoard();
    //   break;
    default:
      return;
  }
}
