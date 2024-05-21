import axios from "axios";
// const KEY = 'AIzaSyDD1g2OCn3Ep9gtJG61hHr9Q95pVGRkNgc'
//const KEY = 'AIzaSyBN9XWyoreI_AmClWo1etjS3UEOBCc8ZHs';
const KEY = "AIzaSyDAfzxpekgGkuL8v5CC5tMYgBQrBe4LspU";

const youtube = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
  params: {
    part: "snippet",
    maxResults: 50,
    key: KEY,
  },
});

export default youtube;
