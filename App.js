import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

const App = () => {
  const download_url = 'https://www.clickdimensions.com/links/TestPDFfile.pdf';

  const download_url1 =
    'https://cdn.pixabay.com/photo/2017/01/08/13/58/cube-1963036_960_720.jpg';

  const download_url2 =
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  const checkPermissions = async () => {
    if (Platform.OS === 'ios') {
      downloadPdf();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permissions Required',
            message: 'App needs access to your storage for offline downloads',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadPdf();
        } else {
          alert('Permissions not granted. Try again');
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  const downloadPdf = () => {
    const date = new Date();
    let pdf_url = download_url2;
    let file_ext = getFileExtention(pdf_url);

    file_ext = '.' + file_ext[0];
    const {config, fs} = RNFetchBlob;
    let dir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          dir +
          '/pdfs_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'In App',
      },
    };
    config(options)
      .fetch('GET', pdf_url)
      .then(response => {
        console.log(JSON.stringify(response));
        alert('File downloaded successfully');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  return (
    <View style={styles.container}>
      <Text>Download App</Text>
      <Button title="Download Now" onPress={checkPermissions} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
