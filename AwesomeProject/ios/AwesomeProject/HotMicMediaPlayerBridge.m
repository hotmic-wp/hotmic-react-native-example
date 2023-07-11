#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(HotMicMediaPlayerBridge, NSObject)

RCT_EXTERN_METHOD(initialize:(NSString *)apiKey token:(NSString *)accessToken)

RCT_EXTERN_METHOD(getStreams:(NSString *)userID limit:(NSInteger)limit skip:(NSInteger)skip resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)

@end