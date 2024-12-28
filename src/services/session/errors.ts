import { ErrorCode } from "@abybylijedno/songbook-protocol";

/**
 * Get error text by error code
 * 
 * @param errorCode 
 * @returns 
 */
export const getErrorText = (errorCode: ErrorCode) => {
  switch (errorCode) {
    case ErrorCode.Unknown:
      return "Nieznany błąd";

    case ErrorCode.InvalidCommand:
      return "Nieprawidłowe polecenie";

    case ErrorCode.SessionNotFound:
      return "Sesja nie została znaleziona";

    case ErrorCode.SessionIdRequired:
      return "Identyfikator sesji jest wymagany";

    case ErrorCode.SessionYouHaveOne:
      return "Masz już jedną sesję";

    case ErrorCode.SessionYouHaveNone:
      return "Nie masz żadnej sesji";

    case ErrorCode.SessionYouAreNotCreator:
      return "Nie jesteś twórcą sesji";

    case ErrorCode.SessionYouAreNotMember:
      return "Nie jesteś członkiem sesji";

    case ErrorCode.SessionCannotLeaveAsCreator:
      return "Nie możesz opuścić sesji jako twórca";

    case ErrorCode.SongNotFound:
      return "Piosenka nie została znaleziona";

    case ErrorCode.SongHashRequired:
      return "Hash piosenki jest wymagany";

    case ErrorCode.SongVerseIdxRequired:
      return "Indeks wersetu piosenki jest wymagany";

    case ErrorCode.SongVerseIdxInvalid:
      return "Nieprawidłowy indeks wersetu piosenki";

    case ErrorCode.SongVerseDoesNotExist:
      return "Werset piosenki nie istnieje";

    default:
      return "Nieznany błąd";
  }
};


/**
 * Get error object by error code
 * 
 * @param errorCode 
 * @returns 
 */
export const getErrorObject = (errorCode: ErrorCode) => new Error(getErrorText(errorCode));
