import { type ISongVerse } from "@/lib/songs/model";
import { MessageType } from "./MessageType";


export interface IMessage {
  type: MessageType;
  songVerse?: ISongVerse;
  information?: string;
}
