"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show submit form when "submit" is clicked */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $submitForm.trigger("reset");
  $submitForm.show();
}

$navSubmit.on("click", navSubmitClick);

/** Show user's own stories when "my stories" is clicked */

function navMyStoriesClick(evt) {
  hidePageComponents();
  showMyStoriesList();
}

$navMyStories.on("click", navMyStoriesClick);

/** Show user's favorited stories when "favorites" is clicked */

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  showFavoritesList();
}

$navFavorites.on("click", navFavoritesClick);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
