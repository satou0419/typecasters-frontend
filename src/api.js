// Define your base URL
// const BASE_URL = "http://localhost:8080";
// const BASE_URL = "https://api-typecasters.azurewebsites.net"; //EXPIRED
const BASE_URL = "https://api-tower-of-words.azurewebsites.net";
// Define your API endpoints
export const LOGIN_ENDPOINT = `${BASE_URL}/user/login`;
export const REGISTER_ENDPOINT = `${BASE_URL}/user/register`;
export const LOGOUT_ENDPOINT = `${BASE_URL}/user/logout`;
export const GET_USER_ID_BY_USERNAME = `${BASE_URL}/user/get_user_id/`;
export const GET_ALL_ITEMS_ENDPOINT = `${BASE_URL}/item/get_all_items`;
export const GET_ALL_FLOORS_ENDPOINT = `${BASE_URL}/floor/get_all_floors`;
export const GET_ENEMIES_BY_FLOOR_ID_ENDPOINT = `${BASE_URL}/adventure_enemy/get_enemy_by_floor_id`;
export const GET_USER_ITEMS_ENDPOINT = `${BASE_URL}/user_item/get_user_items_by/`;
export const GET_USER_DETAILS_ENDPOINT = `${BASE_URL}/user_details/get_user_detail?user_id=`;
export const INSERT_WORD_ARCHIVE = `${BASE_URL}/archive_words/insert`;
export const UPDATE_USER_ENDPOINT = `${BASE_URL}/user/update_user?uid=`;
export const UPDATE_USER_PROGRESS_ENDPOINT = `${BASE_URL}/tower_progress/update_user_progress?user_prog_id=`;
export const BUY_ITEM_ENDPOINT = `${BASE_URL}/user_item/buy_item_single`;
export const GET_ALL_ITEMS = `${BASE_URL}/item/get_all_items`;
export const GET_ARCHIVE_WORD_ENDPOINT = `${BASE_URL}/archive_words/view_by_id/`;
export const CREATE_ROOM = `${BASE_URL}/room/insert`;
export const GET_USER_CREDIT = `${BASE_URL}/user_details/get_credit_amount?userDetailId=`;
export const ITEM_USED = `${BASE_URL}/user_item/use_item`;
export const VIEW_WORD_ARCHIVE = `${BASE_URL}/archive_words/view/`;
export const VIEW_ROOM = `${BASE_URL}/room/view_created_room/`;
export const VIEW_ROOM_BY_ID = `${BASE_URL}/room/view_room_by_id/`;
export const JOIN_ROOM = `${BASE_URL}/room/insert_member_by_code/`;
export const INSERT_STUDENT = `${BASE_URL}/room/insert_member/`;
export const STUDENT_VIEW_ROOM = `${BASE_URL}/room/view_room_by_member/`;
export const VIEW_SIMULATION = `${BASE_URL}/simulation/view_by_room/`;
export const CREATE_GAME = `${BASE_URL}/simulation/insert`;
export const GET_REWARD_BY_FLOOR = `${BASE_URL}/adventure_reward/get_reward_by_floor_id`;
export const VIEW_GAME_BY_ROOM = `${BASE_URL}/simulation/view_by_room/`;
export const SIMULATION_GAMEPLAY = `${BASE_URL}/simulation/view_by_id/`;
export const UPDATE_STUDENT_SIMULATION_PROGRESS = `${BASE_URL}/simulations_participants/edit`;

export const MERRIAM_API = `https://www.dictionaryapi.com/api/v3/references/sd2/json/`;
export const API_KEY = `95454221-2935-4778-b4e6-be2ca5ede0cb`;
export const AUDIO_PATH = `https://media.merriam-webster.com/audio/prons/en/us/mp3/`;
export const VIEW_STUDENT_ROOM = `${BASE_URL}/room/view_room_by_member/`;
// Function to fetch user details
export const fetchUserData = async (userID) => {
  try {
    const response = await fetch(`${GET_USER_DETAILS_ENDPOINT}${userID}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
