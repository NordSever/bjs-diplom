'use strict'

let logout = new LogoutButton();
logout.action = () => ApiConnector.logout(response => {
  if(response.success){
    location.reload();
  }
});

ApiConnector.current(response => {
  if(response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

let ratesBoard = new RatesBoard();
function fillBoardRates() {
  ApiConnector.getStocks(response => {
    if(response.success){
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }  
  })
}
fillBoardRates();
setInterval (fillBoardRates, 60000);




let moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = data => {
  ApiConnector.addMoney(data, response => {
    if(response.success){
    ProfileWidget.showProfile(response.data);
    moneyManager.setMessage(true, 'Перевод успешно выполнен')
  }else {
    moneyManager.setMessage(false, response.error);
  }
});
} 

moneyManager.conversionMoneyCallback = data => ApiConnector.convertMoney(data, response => {
  if(response.success) {
    ProfileWidget.showProfile(response.data);
    moneyManager.setMessage(true,'Конвертация успешно завершена');
  }else {
    moneyManager.setMessage(false, response.error);
  } 
});

moneyManager.sendMoneyCallback = data => ApiConnector.transferMoney(data, response => {
  if(response.success) {
    ProfileWidget.showProfile(response.data);
    moneyManager.setMessage(true,'Перевод успешно отправлен');
  }else {
    moneyManager.setMessage(false, response.error);
  }
})

let favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
  if(response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  };
});

favoritesWidget.addUserCallback = data => ApiConnector.addUserToFavorites(data, response => {
  if(response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
    moneyManager.setMessage(true,'Пользователь успешно добавлен');
  }else {
    moneyManager.setMessage(false, response.error);
  }
})

favoritesWidget.removeUserCallback = (id) => ApiConnector.removeUserFromFavorites(id, response => {
  if(response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
    moneyManager.setMessage(true,'Пользователь удалён');
  }else {
    moneyManager.setMessage(false, response.error);
  }
});    










