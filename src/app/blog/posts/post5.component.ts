import { Component } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-blog-post-5',
  templateUrl: './post5.component.html',
})
export class BlogPost5Component {

  ngAfterViewInit() {
    $(".ui.sticky.page.navigation").sticky({
      context: "#blog"
    });
  }

  contactService = `qolloApp.factory('ContactService', function($http, $q, $rootScope) {
  
  /**
   * Reads the user's phone contacts
   */
  var getContacts = function() {
    var deferred = $q.defer();
    
    // select the contact data you want returned
    var contactFields = ["id", "displayName", "phoneNumbers"];
    
    // when filter = "", all contacts are returned
    // when multiple = true, multiple contacts may be returned
    var contactFindOptions = { filter: "", multiple: true };
    
    var onGetContactsSuccess = function(contacts) {
      deferred.resolve(contacts);
      // use $rootScope to apply the resolved callback
      $rootScope.$apply();
    };
    
    var onGetContactsError = function(contactsError) {
      log("[ERROR] getContacts: {0}", contactsError);
      deferred.reject(contactsError);
      // use $rootScope to apply the rejected callback
      $rootScope.$apply();
    };

    navigator.contacts.find(contactFields, onGetContactsSuccess, onGetContactsError, contactFindOptions);
    return deferred.promise;
  };

  return {
    getContacts : getContacts
  };
});
`;

  webSql = `var getConnection = function() {
  var databaseName = "openqollo";
  var databaseVersion = "1.0";
  var databaseDisplayName = "OpenQollo DB";
  var databaseSize = 100000;
  return window.openDatabase(//
    databaseName, //
    databaseVersion, //
    databaseDisplayName, //
    databaseSize);
};`;

  createTable = `/**
 * Creates a database table for storing phone contacts.
 */
var createTable = function() {

  var create = function(transaction) {
    transaction.executeSql(
      'CREATE TABLE IF NOT EXISTS contacts ' + //
      '(qolloId INTEGER PRIMARY KEY AUTOINCREMENT, ' + //
      'contactId INTEGER UNIQUE, ' + //
      'displayName TEXT UNIQUE, ' + //
      'contactType TEXT)'
    );
  };

  var onCreateSuccess = function() {
    // nothing here
  };

  var onCreateError = function(error) {
    console.log("[ERROR] createTable: " + error);
  };

  getConnection().transaction(create, onCreateError, onCreateSuccess);
};
`;

  insertContacts = `/**
 * Inserts a list of contacts to the database.
 * @param contacts => array of {contactId, contactName, contactType}
 * @return void
 */
var insertContacts = function(contacts) {

  var insert = function(transaction) {
    for (var i = 0; i < contacts.length; i++) {
      var contact = contacts[i];
      var contactId = contact["id"];
      var contactName = contact["displayName"];
      var contactType = contact["contactType"];
      var sql = "INSERT OR REPLACE INTO contacts " + //
            "(contactId, displayName, contactType) " + //
            "VALUES (?, ?, ?)";
      transaction.executeSql(sql, [contactId, contactName, contactType]);
    }
  };

  var onInsertSuccess = function() {
    // nothing here
  };

  var onInsertError = function(error) {
    console.log("[ERROR] insertContacts: " + error);
  };

  getConnection().transaction(insert, onInsertError, onInsertSuccess);
}
`;

  selectContacts = `qolloApp.factory('DatabaseService', function($http, $q) {

  /**
   * Returns an array of contacts that match the given contact type.
   * @param type => string
   * @return contacts => array of {contactId, displayName} objects
   */
  var selectContacts = function(contactType) {
    var deferred = $q.defer();
    
    getConnection().transaction(
      function(transaction) {
        var sql = "SELECT contactId, displayName " + //
          "FROM contacts " + //
          "WHERE contactType = ?";
        transaction.executeSql(sql, [contactType],
          function(transaction, results) {
            var contacts = [];
            for (var i = 0; i < results.rows.length; i++) {
              var contact = results.rows.item(i);
              contacts.push(contact);
            }
            deferred.resolve(contacts);
          },
          function(transaction, error) {
            console.log("[ERROR] selectContact: " + error);
            deferred.reject(error);
          }
        );
      },
      function(error) {
        console.log("[ERROR] selectContact: " + error);
        deferred.reject(error);
      }
    );
    
    return deferred.promise;
  }

  return {
    selectContact : selectContact
  }
});`;
}
