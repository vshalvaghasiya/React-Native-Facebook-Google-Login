/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * 
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert} from 'react-native';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
GoogleSignin.configure();
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSigninInProgress: false
    };
  }

  componentDidMount() {
    this.setupGoogleSignin();
  }
  
  googleAuth() {
    Alert.alert('Success null');
    GoogleSignin.signIn()
      .then((user) => {
        console.log(user);
      })
      .catch((err) => {
        console.log('WRONG SIGNIN', err);
      })
      .done();
  }

  LogOut() {
    Alert.alert('Success null');
    try {
      GoogleSignin.revokeAccess();
      GoogleSignin.signOut();
      alert('Success');
    } catch (error) {
      console.error(error);
    }
  };

  async setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('Result:-', userInfo);
      Alert.alert('Success');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('SIGN_IN_CANCELLED');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
        Alert.alert('IN_PROGRESS');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Alert.alert('PLAY_SERVICES_NOT_AVAILABLE');
      } else {
        // some other error happened
        Alert.alert('OTHER');
      }
    }
  }

  facebookLogin(){
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      function(result) {
        if (result.isCancelled) {
          alert('Login was cancelled');
        } else {
          alert('Login was successful with permissions: '
            + result.grantedPermissions.toString());
            // console.log('Result:-', result);
            AccessToken.getCurrentAccessToken().then((data) => {
              const { accessToken } = data
              this.initUser(accessToken)
            }) 
        }
      },
      function(error) {
        alert('Login failed with error: ' + error);
      }
    );
  }

  initUser(token) {
    fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + token)
    .then((response) => response.json())
    .then((json) => {
      console.log('Result:-', json);
      
      // Some user object has been set up somewhere, build that user here
      // user.name = json.name
      // user.id = json.id
      // user.user_friends = json.friends
      // user.email = json.email
      // user.username = json.name
      // user.loading = false
      // user.loggedIn = true
      // user.avatar = setAvatar(json.id)      
    })
    .catch(() => {
      reject('ERROR GETTING DATA FROM FACEBOOK')
    })
  }

  render() {
    return (
      <View style={styles.container}>
      <View >
        <LoginButton
          onLoginFinished={
            (error, result) => {
              if (error) {
                console.log("login has error: " + result.error);
              } else if (result.isCancelled) {
                console.log("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    console.log('result:-',data.accessToken.toString())
                    const { accessToken } = data
                    this.initUser(accessToken)
                  }
                )
              }
            }
          }
          onLogoutFinished={() => console.log("logout.")}/>
          </View>
          <View style={styles.facebook}>
            <Text onPress={() => this.facebookLogin()} >facebook</Text>
            </View>

            <View style={styles.google}>
            <Text onPress={() => this.googleAuth.bind(this)} >Google</Text>
            </View>
            <View style={styles.google}>
            <Text onPress={() => this.LogOut.bind(this)} >SignOut</Text>
            </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  facebook: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  google: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  }
});
