import { View, Text, StyleSheet, StatusBar, Pressable, ScrollView,Alert } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN, BACKGROUND_COLOR, DARKED_BORDER_COLOR, FIRETV_BASE_URL, FIRETV_BASE_URL_STAGING, NORMAL_TEXT_COLOR, PAGE_HEIGHT, VIDEO_AUTH_TOKEN } from '../constants';
import FastImage from 'react-native-fast-image';
import Footer from './footer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackActions } from '@react-navigation/native';
import Header from './header';
import axios from 'axios';
var watchlaterTasks = [];
export default function WatchLater({ navigation }) {
    const [watchlistVideo, setWatchlistVideo] = useState();
    const dataFetchedRef = useRef(false);

    const loadData = async () => {
        var sessionId = await AsyncStorage.getItem('session');
        var region = await AsyncStorage.getItem('country_code');

        axios.get(FIRETV_BASE_URL_STAGING + "/users/" + sessionId + "/playlists/watchlater/listitems?auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN + "&region=" + region).then(response => {
            console.log(JSON.stringify(response.data.data.items.length));
            for (var i = 0; i < response.data.data.items.length; i++) {
                watchlaterTasks.push({ 'title': response.data.data.items[i].title, 'thumbnail': response.data.data.items[i].thumbnails.high_4_3.url, 'seo_url': response.data.data.items[i].seo_url, 'theme': response.data.data.items[i].theme,'listitem_id': response.data.data.items[i].listitem_id,'contentId':response.data.data.items[i].content_id})
            }
            setWatchlistVideo(watchlaterTasks)
            watchlaterTasks = [];
        }).catch(error => {
            //console.log(JSON.stringify(error.response.data));
        })
    }
    const deleteWatchLater = async (listitem_id,contentId) => {
        var sessionId = await AsyncStorage.getItem('session');
        var region = await AsyncStorage.getItem('country_code');
        Alert.alert('Delete File', 'Please confirm to delete the file from wishlist.', [
          {
            text: 'Cancel',
            onPress: () => { },
            style: 'cancel',
          },
          {
            text: 'OK', onPress: async () => {
              console.log('OK Pressed')
              await axios.delete(FIRETV_BASE_URL_STAGING+"/users/"+sessionId+"/playlists/watchlater/listitems/"+listitem_id+"?auth_token="+VIDEO_AUTH_TOKEN+"&access_token="+ACCESS_TOKEN+"&region="+region).then(resp=>{
                AsyncStorage.removeItem('watchLater_'+contentId)
                loadData()
              }).catch(err=>{})
            }
          },
        ]);
      }

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        loadData();
    })
    return (
        <View style={styles.mainContainer}>
            <Header pageName="WATCH-LATER"></Header>
            <ScrollView style={{ padding: 10 }}>
                <Text style={{ color: NORMAL_TEXT_COLOR }}>Watchlist</Text>
                <View style={{}}>
                    {watchlistVideo ?
                        // <Text style={{color:'white'}}>{JSON.stringify(watchlistVideo[0].title)}</Text>
                        watchlistVideo.map((singleVideo, index) => {
                            return (
                                <View key={index} style={{ borderColor: DARKED_BORDER_COLOR, borderRadius: 15, borderWidth: 1, width: "99%", marginBottom: 10 }}>
                                    <View style={{ flexDirection: 'row', width: "100%" }}>

                                        {singleVideo.thumbnail ?
                                            <Pressable onPress={() => navigation.dispatch(StackActions.replace('Episode', { seoUrl: singleVideo.seo_url, theme: singleVideo.theme }))} style={{ alignItems: 'center', flexDirection: 'row', }}>


                                                <FastImage
                                                    style={{ width: "35%", height: 80, left: 0, borderRadius: 15, marginRight: 5 }}
                                                    source={{ uri: singleVideo.thumbnail, priority: FastImage.priority.high }}
                                                    resizeMode={FastImage.resizeMode.stretch}
                                                />
                                                <View style={{ justifyContent: 'center', alignSelf: 'center', width: "53%", marginRight: 2 }}>
                                                    <Text style={{ color: NORMAL_TEXT_COLOR }}>{singleVideo.title}</Text>
                                                </View>
                                                <View style={{ alignSelf: 'center', width: "10%" }}>
                                                    <Pressable onPress={() => deleteWatchLater(singleVideo.listitem_id,singleVideo.contentId)}><MaterialCommunityIcons name="delete-circle" size={30} color={NORMAL_TEXT_COLOR} /></Pressable>
                                                </View>

                                            </Pressable>
                                            : ""}


                                    </View>
                                </View>
                            )
                        })
                        :
                        ""
                    }
                </View>
            </ScrollView>
            <View style={{ position: 'absolute', bottom: 0 }}>
                <Footer pageName="WATCH-LATER"></Footer>
            </View>
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: BACKGROUND_COLOR },
})