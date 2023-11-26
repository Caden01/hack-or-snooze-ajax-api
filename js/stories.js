"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <div>
          ${addDeleteBtn(story, currentUser)}
          ${addStar(story, currentUser)} 
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small>
          <small class="story-author">by ${story.author}</small>
          <small class="story-user">posted by ${story.username}</small>
        </div>
      </li>
    `);
}

/** Gives story start that is either favorited or unfavorited */

function addStar(story, user) {
  const isFavorite = user.favorites.some((s) => s.storyId === story.storyId);
  const starType = isFavorite ? "fas" : "far";
  return `
    <span class="star">
      <i class="${starType} fa-star"></i>
    </span>
  `;
}

function addDeleteBtn(story, user) {
  const isMyStory = user.ownStories.some((s) => s.storyId === story.storyId);
  if ($allStoriesList.is(":visible")) {
    return "";
  } else if (isMyStory) {
    return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>
    `;
  } else {
    return "";
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();

  if ($favoritesList.is(":visible") || $myStoriesList.is(":visible")) {
    $favoritesList.hide();
    $myStoriesList.hide();
  }
}

/** Handles with submitting new story with the submit form */

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  const title = $("#title").val();
  const author = $("#author").val();
  const url = $("#url").val();
  const username = currentUser.username;
  const data = { title, url, author, username };

  const story = await storyList.addStory(currentUser, data);

  const newStory = generateStoryMarkup(story);
  $allStoriesList.prepend(newStory);

  putStoriesOnPage();
}

$submitForm.on("submit", submitNewStory);

/** Deletes story from page */

async function deletStory(evt) {
  const storyId = $(evt.target).closest("li").attr("id");

  await storyList.removeStory(currentUser, storyId);
  await putStoriesOnPage();
}

$body.on("click", ".trash-can", deletStory);

/** Shows my stories list */

function showMyStoriesList() {
  console.debug("showMyStoriesList");

  $myStoriesList.empty();

  if ($favoritesList.is(":visible") || $submitForm.is(":visible")) {
    $favoritesList.hide();
    $submitForm.hide();
  }

  if (currentUser.ownStories.length === 0) {
    $myStoriesList.append("<p>No stories added by user yet!</p>");
  } else {
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story);
      $myStoriesList.append($story);
    }
  }

  $myStoriesList.show();
}

/** Shows favorites list */

function showFavoritesList() {
  console.debug("showFavoritesList");

  $favoritesList.empty();

  if ($myStoriesList.is(":visible") || $submitForm.is(":visible")) {
    $myStoriesList.hide();
    $submitForm.hide();
  }

  if (currentUser.favorites.length === 0) {
    $favoritesList.append("<p>No favorites added!</p>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritesList.append($story);
    }
  }

  $favoritesList.show();
}

/** Favorite/Unfavorite a story */

async function toggleFavorite(evt) {
  console.debug("toggleFavorites");

  const $target = $(evt.target);
  const storyId = $target.closest("li").attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  if ($target.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$allStoryLists.on("click", toggleFavorite);
