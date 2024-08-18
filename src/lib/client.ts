import { useStateStore } from '@/stores/state';
import { Req } from "./requests/Req";

import type { ISong } from "./songs/model/ISong";
import { ReqListSongs, ReqSearchSongs, ReqGetSong } from "./songs/requests";

import  { type IPlaylist, type IPlaylistSong } from "./playlists/model";
import { ReqListPlaylists, ReqListPlaylistsWithoutSong,
  ReqGetPlaylist, ReqCreatePlaylist, ReqDeletePlaylist, ReqUpdatePlaylist,
  ReqListPlaylistSongs, ReqAddSongToPlaylist, ReqRemoveSongFromPlaylist } from "./playlists/requests";

import type { WorkerResponse } from "./responses/WorkerResponse";

/**
 * Map of requests to resolve promises
 */
const requests = new Map<string, [Function, Function]>();

/**
 * Main worker to handle requests
 */
const worker = new Worker(new URL('../worker', import.meta.url), {
  type: 'module'
});

/**
 * Handle worker response
 * @param event MessageEvent
 */
worker.onmessage = (event) => {
  const response: WorkerResponse = event.data;

  if (!response.uuid) {
    return;
  }

  if (requests.has(response.uuid)) {
    const r = requests.get(response.uuid);
    if (r) {
      if (typeof response.data === "string" && response.data.startsWith("ERR!")) {
        r[1](response.data.substring(5));
      } else {
        r[0](response.data);
      }
    }
    requests.delete(response.uuid);
  }
};


let stateStore: null | ReturnType<typeof useStateStore> = null;

function getStateStore() {
  if (!stateStore) {
    stateStore = useStateStore();
  }
  return stateStore;
}


/**
 * Post request to worker
 * @param request Req
 * @returns Promise<Object>
 */
function post(request: Req): Promise<Object> {
  const promise = new Promise<Object>((resolve, reject) => {
    requests.set(request.uuid, [resolve, reject]);
  });
  worker.postMessage(request);
  return promise;
}

//#region ----------------- Songs -----------------

/**
 * Get song
 * @param hash Song hash
 * @returns Promise<ISong>
 */
export function getSong(hash: string): Promise<ISong | null> {
  return post(new ReqGetSong(hash)) as Promise<ISong | null>;
}

/**
 * Get songs list
 * @returns Promise<Array<ISong>>
 */
export function getSongsList(): Promise<Array<ISong>> {
  return post(new ReqListSongs()) as Promise<Array<ISong>>;
}

/**
 * Search songs
 * @returns Promise<Array<ISong>>
 */
export function searchSongs(query: string): Promise<Array<ISong>> {
  return post(new ReqSearchSongs(query)) as Promise<Array<ISong>>;
}

//#endregion

//#region ----------------- Playlist -----------------

/**
 * Get playlist
 * @param id number
 * @returns Promise<IPlaylist>
 */
export function getPlaylist(id: number): Promise<IPlaylist> {
  return post(new ReqGetPlaylist(id)) as Promise<IPlaylist>;
}

/**
 * Create playlist
 * @param playlist IPlaylist
 * @returns Promise<IPlaylist>
 */
export async function createPlaylist(playlist: IPlaylist): Promise<IPlaylist> {
  const id = (await post(new ReqCreatePlaylist(playlist))) as number;
  playlist.id = id;
  return playlist;
}

/**
* Update playlist
* @param playlist IPlaylist
* @returns Promise<IPlaylist>
*/
export function deletePlaylist(id: number): Promise<boolean> {
 return post(new ReqDeletePlaylist(id)) as Promise<boolean>;
}

/**
* Update playlist
* @param playlist IPlaylist
* @returns Promise<IPlaylist>
*/
export function updatePlaylist(id: number, changes: Object): Promise<IPlaylist> {
 return post(new ReqUpdatePlaylist(id, changes)) as Promise<IPlaylist>;
}

/**
 * Get playlists list
 * @returns Promise<Array<IPlaylist>>
 */
export function getPlaylistsList(): Promise<Array<IPlaylist>> {
  return post(new ReqListPlaylists()) as Promise<Array<IPlaylist>>;
}

/**
 * Get playlists list without song
 * @returns Promise<Array<IPlaylist>>
 */
export function getPlaylistsListWithoutSong(hash: string): Promise<Array<IPlaylist>> {
  return post(new ReqListPlaylistsWithoutSong(hash)) as Promise<Array<IPlaylist>>;
}

//#endregion

//#region ----------------- Playlist's songs -----------------

/**
 * Get playlist's songs
 * @param id number
 * @returns Promise<ISong[]>
 */
export function getPlaylistSongs(id: number): Promise<IPlaylistSong[]> {
  return post(new ReqListPlaylistSongs(id)) as Promise<IPlaylistSong[]>;
}

/**
 * Add song to playlist
 * @param playlistId number
 * @param songHash string
 * @returns Promise<void>
 */
export function addSongToPlaylist(playlistId: number, songHash: string): Promise<IPlaylist> {
  return post(new ReqAddSongToPlaylist(playlistId, songHash)) as Promise<IPlaylist>;
}

/**
 * Remove song from playlist
 * @param playlistId number
 * @param songHash string
 * @returns Promise<void>
 */
export function removeSongFromPlaylist(playlistId: number, songHash: string): Promise<IPlaylist> {
  return post(new ReqRemoveSongFromPlaylist(playlistId, songHash)) as Promise<IPlaylist>;
}

//#endregion
