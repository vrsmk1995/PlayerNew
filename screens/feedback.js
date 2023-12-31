import { View, Text, StyleSheet, Pressable, StatusBar, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, } from 'react'
import { ACCESS_TOKEN, AUTH_TOKEN, BACKGROUND_COLOR, DETAILS_TEXT_COLOR, FIRETV_BASE_URL_STAGING, IMAGE_BORDER_COLOR, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, TAB_COLOR, VIDEO_AUTH_TOKEN } from '../constants'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import NormalHeader from './normalHeader'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Modal from "react-native-modal";
import { StackActions } from '@react-navigation/native'

export default function Feedback({ navigation }) {
  var arr = [];
  const [data, setdata] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedchannel, setselectedchannel] = useState('');
  const [selectedchannelname, setselectedchannelname] = useState('');
  const [showname, setshowname] = useState();
  const [comments, setcomments] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setloading] = useState(false);
  const [email, setemail] = useState("");
 

  const loaddata = async () => {
    const region = await AsyncStorage.getItem('country_code');
    var email = await AsyncStorage.getItem('email_id');
    if (email != "" && email != null && email != 'null') {
      setemail(email)
    }
    axios.get(FIRETV_BASE_URL_STAGING + "catalog_lists/channels.gzip?region=" + region + "&auth_token=" + VIDEO_AUTH_TOKEN + "&access_token=" + ACCESS_TOKEN).then(resp => {
      for (var i = 0; i < resp.data.data.catalog_list_items.length; i++) {
        arr.push({ "displayTitle": resp.data.data.catalog_list_items[i].display_title, 'friendly_id': resp.data.data.catalog_list_items[i].friendly_id })
      }
      setdata(arr);
    }).catch(error => { })
  }
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  function ValidateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (input.match(validRegex))
      return true;
    else
      return false;
  }
  const submitfeedback = async () => {
    setloading(true);

    const region = await AsyncStorage.getItem('country_code');
    
      if (selectedchannelname == "" || selectedchannelname == null || comments == "" || comments == null || showname == "" || showname == null || email == "" || email == null) { 
       alert('Please fill all the mandatory details.');
       setloading(false);
      }
      else {
        // axios.post(FIRETV_BASE_URL_STAGING + "users/feedback", {
        //   access_token: ACCESS_TOKEN,
        //   auth_token: VIDEO_AUTH_TOKEN,
        //   channel_name: selectedchannelname,
        //   comments: comments,
        //   email_id: email,
        //   region: region,
        //   show_name: showname
        // }, {
        //   headers: {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json',
        //   }
        // }).then(response => {
        //   setloading(false);
        //   setSubmitted(true)

        // }).catch(error => {
        //   alert("Something went wrong. Please try again later.")
        // })
      }

  }
  useEffect(() => {
    loaddata()
  }, [])
  return (
    <ScrollView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
      <NormalHeader></NormalHeader>
      {submitted ?
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require("../assets/images/icn_successfull.png")} style={{ width: '100%' }} resizeMode='contain' />
          <Text style={{ color: NORMAL_TEXT_COLOR, marginTop: 20, fontSize: 20, marginBottom: 20 }}>Successfully Submitted.</Text>
          <Text style={{ color: NORMAL_TEXT_COLOR, marginTop: 20, fontSize: 16, marginBottom: 20 }}>We appreciate for your valuable time.</Text>

          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
            <TouchableOpacity onPress={() => { navigation.dispatch(StackActions.replace('Home', { pageFriendlyId: 'featured-1' })) }} style={{ backgroundColor: TAB_COLOR, paddingTop: 12, paddingBottom: 12, paddingLeft: 25, paddingRight: 25, borderRadius: 15 }}><Text style={{ color: NORMAL_TEXT_COLOR, fontWeight: 'bold' }}>Go to Home</Text></TouchableOpacity>
          </View>
        </View>
        :
        <View>
          <View style={{ justifyContent: 'center', alignItems: 'center', padding: 15 }}>
            <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16, }}>Your opinions, your feedback, your suggestions, let them flow. This is your space. It will help us in improving the app.</Text>
          </View>
          
            <View style={styles.dropdowncontainer}>
              <View style={styles.dropdowninnerview}>
                <View style={{ marginTop: 20 }}>
                  <TextInput onChangeText={setemail} value={email} placeholder='Email Id *' placeholderTextColor={SLIDER_PAGINATION_UNSELECTED_COLOR} style={{ color: NORMAL_TEXT_COLOR, width: '100%', padding: 10, fontSize: 18, }} />
                </View>
              </View>
            </View>
           

          <Pressable onPress={toggleModal}>
            <View style={styles.dropdowncontainer}>
              <View style={styles.dropdowninnerview}>
                <View style={{}}>
                  {selectedchannel != "" ?
                    <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 18, padding: 10 }}>{selectedchannel}</Text>
                    :
                    <Text style={{ color: SLIDER_PAGINATION_UNSELECTED_COLOR, fontSize: 18, padding: 10 }}>Select Any Channel</Text>
                  }
                  <MaterialIcons name='arrow-drop-down' size={25} color={SLIDER_PAGINATION_UNSELECTED_COLOR} style={{ position: 'absolute', right: 15, top: 10 }} />
                </View>
              </View>
            </View>
          </Pressable>


          <View style={styles.dropdowncontainer}>
            <View style={styles.dropdowninnerview}>
              <View style={{}}>
                <TextInput onChangeText={setshowname} value={showname} placeholder='Show Name *' placeholderTextColor={SLIDER_PAGINATION_UNSELECTED_COLOR} style={{ color: NORMAL_TEXT_COLOR, width: '100%', padding: 10, fontSize: 18, }} />
              </View>
            </View>
          </View>

          <View style={styles.dropdowncontainer}>
            <View style={styles.dropdowninnerview}>
              <View style={{ marginTop: 20 }}>
                <TextInput onChangeText={setcomments} multiline={true} value={comments} placeholder='Comments *' placeholderTextColor={SLIDER_PAGINATION_UNSELECTED_COLOR} style={{ color: NORMAL_TEXT_COLOR, width: '100%', padding: 10, fontSize: 18, }} />
              </View>
            </View>
          </View>
          {loading ? <View style={{ justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator color={NORMAL_TEXT_COLOR} size={'large'}></ActivityIndicator></View> : ""}
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
            <TouchableOpacity onPress={submitfeedback} style={{ backgroundColor: TAB_COLOR, paddingTop: 12, paddingBottom: 12, paddingLeft: 25, paddingRight: 25, borderRadius: 15 }}><Text style={{ color: NORMAL_TEXT_COLOR, fontWeight: 'bold' }}>Submit</Text></TouchableOpacity>
          </View>

          <Modal
            isVisible={isModalVisible}
            testID={'modal'}
            animationIn="slideInDown"
            animationOut="slideOutDown"
            onBackdropPress={toggleModal}
            backdropColor={"black"}
            backdropOpacity={0.40}
          >
            <View style={{ backgroundColor: NORMAL_TEXT_COLOR, width: '100%', backgroundColor: BACKGROUND_COLOR }}>
              {data.map((channel, ind) => {
                return (
                  <Pressable key={'channel' + ind} onPress={() => { setselectedchannel(channel.displayTitle); setselectedchannelname(channel.friendly_id); toggleModal() }}>
                    <View style={{ padding: 13, borderBottomColor: IMAGE_BORDER_COLOR, borderBottomWidth: 0.5 }}>
                      <Text style={{ color: NORMAL_TEXT_COLOR }}>{channel.displayTitle}</Text>
                    </View>
                  </Pressable>
                )
              })}
            </View>
          </Modal>
        </View>
      }
      <StatusBar style="auto" />

    </ScrollView>
  )
}


const styles = StyleSheet.create({
  dropdowncontainer: { justifyContent: 'center', alignItems: 'center', padding: 15 },
  dropdowninnerview: { borderBottomColor: DETAILS_TEXT_COLOR, borderBottomWidth: 1, width: '100%' },
  textstyle: { color: NORMAL_TEXT_COLOR, fontSize: 18 },
})