import Foundation
import React
import HotMicMediaPlayer

@objc(HotMicMediaPlayerBridge)
class HotMicMediaPlayerBridge: NSObject {
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc(initialize:token:)
  func initialize(apiKey: String, accessToken: String) {
    print("Initializing HotMicMediaPlayer with apiKey: \(apiKey) and accessToken: \(accessToken)")
    HMMediaPlayer.initialize(apiKey: apiKey, accessToken: accessToken)
    print("HotMicMediaPlayer initialized successfully")
  }
  
  @objc(getStreams:limit:skip:resolver:rejecter:)
  func getStreams(userID: String?, limit: Int, skip: Int, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    print("getStreams method called with userID: \(String(describing: userID)), limit: \(limit), skip: \(skip)")
    HMMediaPlayer.getStreams(live: true, scheduled: true, vod: true, userID: userID, limit: limit, skip: skip) { result in
      print("getStreams callback called with result: \(result)")
      switch result {
      case .success(let streams):
          print("getStreams success with streams: \(streams)")
          let serializedStreams = streams.map { (stream) -> [String: Any?] in
              return [
                  "id": stream.id,
                  "state": stream.state.rawValue,
                  "type": stream.type.rawValue,
                  "thumbnail": stream.thumbnail?.absoluteString,
                  "title": stream.title,
                  "description": stream.description,
              ]
          }
          resolver(serializedStreams)
      case .failure(let error):
          print("getStreams failure with error: \(error)")
          rejecter("GET_STREAMS_ERROR", "Failed to get streams", error)
      }
    }
  }
  
}

