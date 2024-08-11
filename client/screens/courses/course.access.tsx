
// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, FlatList, StyleSheet, Alert } from 'react-native';
// import { Picker } from '@react-native-picker/picker';

// const CourseAccess = () => {
//     const [courses, setCourses] = useState<any[]>([]);
//     const [selectedCourse, setSelectedCourse] = useState<string>('');
//     const [years, setYears] = useState<any[]>([]);
//     const [selectedYear, setSelectedYear] = useState<string>('');
//     const [subjects, setSubjects] = useState<any[]>([]);
//     const [selectedSubject, setSelectedSubject] = useState<string>('');
//     const [questions, setQuestions] = useState<CommentType[]>([]);

//     // Fetch courses
//     useEffect(() => {
//         console.log('Fetching courses...');
//         fetch('http://192.168.29.88:8000/api/v1/get-courses')
//             .then(response => {
//                 console.log('Response:', response);
//                 return response.json();
//             })
//             .then(data => {
//                 console.log('Data:', data);
//                 if (data.success) {
//                     setCourses(data.courses || []);
//                     console.log('Courses set:', data.courses);
//                 } else {
//                     Alert.alert('Error', 'Failed to fetch courses.');
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching courses:', error);
//                 Alert.alert('Error', 'Error fetching courses.');
//             });
//     }, []);

//     // Fetch years when a course is selected
//     useEffect(() => {
//         if (selectedCourse) {
//             console.log('Fetching years for course:', selectedCourse);
//             fetch(`http://192.168.29.88:8000/api/v1/course/${selectedCourse}/years`)
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log('Years data:', data);
//                     if (data.success) {
//                         setYears(data.years || []);
//                         console.log('Years set:', data.years);
//                     } else {
//                         Alert.alert('Error', 'Failed to fetch years.');
//                     }
//                 })
//                 .catch(() => Alert.alert('Error', 'Error fetching years.'));
//         } else {
//             setYears([]);
//             setSubjects([]);
//             setQuestions([]);
//         }
//     }, [selectedCourse]);

//     // Fetch subjects when a year is selected
//     useEffect(() => {
//         if (selectedYear && selectedCourse) {
//             console.log('Fetching subjects for year:', selectedYear);
//             fetch(`http://192.168.29.88:8000/api/v1/course/${selectedCourse}/year/${selectedYear}/subjects`)
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log('Subjects data:', data);
//                     if (data.success) {
//                         setSubjects(data.subjects || []);
//                         console.log('Subjects set:', data.subjects);
//                     } else {
//                         Alert.alert('Error', 'Failed to fetch subjects.');
//                     }
//                 })
//                 .catch(() => Alert.alert('Error', 'Error fetching subjects.'));
//         } else {
//             setSubjects([]);
//             setQuestions([]);
//         }
//     }, [selectedYear, selectedCourse]);

//     // Fetch questions when a subject is selected
//     useEffect(() => {
//         if (selectedSubject && selectedYear && selectedCourse) {
//             console.log('Fetching questions for subject:', selectedSubject);
//             fetch(`http://192.168.29.88:8000/api/v1/course/${selectedCourse}/year/${selectedYear}/subject/${selectedSubject}/questions`)
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log('Questions data:', data);
//                     if (data.success) {
//                         setQuestions(data.questions || []);
//                         console.log('Questions set:', data.questions);
//                     } else {
//                         Alert.alert('Error', 'Failed to fetch questions.');
//                     }
//                 })
//                 .catch(() => Alert.alert('Error', 'Error fetching questions.'));
//         } else {
//             setQuestions([]);
//         }
//     }, [selectedSubject, selectedYear, selectedCourse]);

//     return (
//         <View style={styles.container}>
//             <Text style={styles.header}>Select Your Course</Text>

//             <View style={styles.pickerContainer}>
//                 <Text>Course:</Text>
//                 <Picker
//                     selectedValue={selectedCourse}
//                     onValueChange={(itemValue) => setSelectedCourse(itemValue)}
//                     style={styles.picker}
//                 >
//                     <Picker.Item label="Select a course" value="" />
//                     {courses.map(course => (
//                         <Picker.Item key={course._id} label={`${course.name} (${course.tags})`} value={course._id} />

//                     ))}
//                 </Picker>
//             </View>

//             <View style={styles.pickerContainer}>
//                 <Text>Year:</Text>
//                 <Picker
//                     selectedValue={selectedYear}
//                     onValueChange={(itemValue) => setSelectedYear(itemValue)}
//                     style={styles.picker}
//                     enabled={!!selectedCourse}
//                 >
//                     <Picker.Item label="Select a year" value="" />
//                     {years.length > 0 ? (
//                         years.map(year => (
//                             <Picker.Item key={year._id} label={year.year} value={year._id} />
//                         ))
//                     ) : (
//                         <Picker.Item label="No years available" value="" />
//                     )}
//                 </Picker>
//             </View>

//             <View style={styles.pickerContainer}>
//                 <Text>Subject:</Text>
//                 <Picker
//                     selectedValue={selectedSubject}
//                     onValueChange={(itemValue) => setSelectedSubject(itemValue)}
//                     style={styles.picker}
//                     enabled={!!selectedYear}
//                 >
//                     <Picker.Item label="Select a subject" value="" />
//                     {subjects.map(subject => (
//                         <Picker.Item key={subject._id} label={subject.name} value={subject._id} />
//                     ))}
//                 </Picker>
//             </View>

//             <View style={styles.questionsContainer}>
//                 <Text style={styles.subHeader}>Questions</Text>
//                 {questions.length > 0 ? (
//                     <FlatList
//                         data={questions}
//                         keyExtractor={(item) => item._id}
//                         renderItem={({ item }) => (
//                             <View style={styles.questionCard}>
//                                 <Text>{item.questionText || 'No question text available'}</Text>
//                                 {item.questionImage && (
//                                     <Image source={{ uri: item.questionImage.url }} style={styles.image} />
//                                 )}
//                                 <Text>{item.answerText || 'No answer text available'}</Text>
//                                 {item.answerImage && (
//                                     <Image source={{ uri: item.answerImage.url }} style={styles.image} />
//                                 )}

//                             </View>
//                         )}
//                     />
//                 ) : (
//                     <Text>No questions available for the selected options.</Text>
//                 )}
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//         backgroundColor: '#fff',
//     },
//     header: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 16,
//     },
//     pickerContainer: {
//         marginBottom: 16,
//     },
//     picker: {
//         height: 50,
//         width: '100%',
//     },
//     questionsContainer: {
//         flex: 1,
//     },
//     subHeader: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 8,
//     },
//     questionCard: {
//         marginBottom: 16,
//     },
//     image: {
//         width: '100%',
//         height: 200,
//         resizeMode: 'cover',
//         marginVertical: 8,
//     },
// });

// export default CourseAccess;
// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, FlatList, StyleSheet, Alert, Modal, TouchableOpacity, Button } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { WebView } from 'react-native-webview'; // Import WebView

// const CourseAccess = () => {
//     const [courses, setCourses] = useState<any[]>([]);
//     const [selectedCourse, setSelectedCourse] = useState<string>('');
//     const [years, setYears] = useState<any[]>([]);
//     const [selectedYear, setSelectedYear] = useState<string>('');
//     const [subjects, setSubjects] = useState<any[]>([]);
//     const [selectedSubject, setSelectedSubject] = useState<string>('');
//     const [questions, setQuestions] = useState<CommentType[]>([]);
//     const [videoUrl, setVideoUrl] = useState<string | null>(null);
//     const [modalVisible, setModalVisible] = useState<boolean>(false);

//     // Fetch courses
//     useEffect(() => {
//         console.log('Fetching courses...');
//         fetch('http://192.168.29.88:8000/api/v1/get-courses')
//             .then(response => response.json())
//             .then(data => {
//                 if (data.success) {
//                     setCourses(data.courses || []);
//                 } else {
//                     Alert.alert('Error', 'Failed to fetch courses.');
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching courses:', error);
//                 Alert.alert('Error', 'Error fetching courses.');
//             });
//     }, []);

//     // Fetch years when a course is selected
//     useEffect(() => {
//         if (selectedCourse) {
//             fetch(`http://192.168.29.88:8000/api/v1/course/${selectedCourse}/years`)
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.success) {
//                         setYears(data.years || []);
//                     } else {
//                         Alert.alert('Error', 'Failed to fetch years.');
//                     }
//                 })
//                 .catch(() => Alert.alert('Error', 'Error fetching years.'));
//         } else {
//             setYears([]);
//             setSubjects([]);
//             setQuestions([]);
//         }
//     }, [selectedCourse]);

//     // Fetch subjects when a year is selected
//     useEffect(() => {
//         if (selectedYear && selectedCourse) {
//             fetch(`http://192.168.29.88:8000/api/v1/course/${selectedCourse}/year/${selectedYear}/subjects`)
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.success) {
//                         setSubjects(data.subjects || []);
//                     } else {
//                         Alert.alert('Error', 'Failed to fetch subjects.');
//                     }
//                 })
//                 .catch(() => Alert.alert('Error', 'Error fetching subjects.'));
//         } else {
//             setSubjects([]);
//             setQuestions([]);
//         }
//     }, [selectedYear, selectedCourse]);

//     // Fetch questions when a subject is selected
//     useEffect(() => {
//         if (selectedSubject && selectedYear && selectedCourse) {
//             fetch(`http://192.168.29.88:8000/api/v1/course/${selectedCourse}/year/${selectedYear}/subject/${selectedSubject}/questions`)
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.success) {
//                         setQuestions(data.questions || []);
//                     } else {
//                         Alert.alert('Error', 'Failed to fetch questions.');
//                     }
//                 })
//                 .catch(() => Alert.alert('Error', 'Error fetching questions.'));
//         } else {
//             setQuestions([]);
//         }
//     }, [selectedSubject, selectedYear, selectedCourse]);

//     const handleViewVideoSolution = (videoUrl: string) => {
//         setVideoUrl(videoUrl);
//         setModalVisible(true);
//     };

//     const handleCloseModal = () => {
//         setModalVisible(false);
//         setVideoUrl(null);
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.header}>Select Your Course</Text>

//             <View style={styles.pickerContainer}>
//                 <Text>Course:</Text>
//                 <Picker
//                     selectedValue={selectedCourse}
//                     onValueChange={(itemValue) => setSelectedCourse(itemValue)}
//                     style={styles.picker}
//                 >
//                     <Picker.Item label="Select a course" value="" />
//                     {courses.map(course => (
//                         <Picker.Item key={course._id} label={`${course.name} (${course.tags})`} value={course._id} />
//                     ))}
//                 </Picker>
//             </View>

//             <View style={styles.pickerContainer}>
//                 <Text>Year:</Text>
//                 <Picker
//                     selectedValue={selectedYear}
//                     onValueChange={(itemValue) => setSelectedYear(itemValue)}
//                     style={styles.picker}
//                     enabled={!!selectedCourse}
//                 >
//                     <Picker.Item label="Select a year" value="" />
//                     {years.length > 0 ? (
//                         years.map(year => (
//                             <Picker.Item key={year._id} label={year.year} value={year._id} />
//                         ))
//                     ) : (
//                         <Picker.Item label="No years available" value="" />
//                     )}
//                 </Picker>
//             </View>

//             <View style={styles.pickerContainer}>
//                 <Text>Subject:</Text>
//                 <Picker
//                     selectedValue={selectedSubject}
//                     onValueChange={(itemValue) => setSelectedSubject(itemValue)}
//                     style={styles.picker}
//                     enabled={!!selectedYear}
//                 >
//                     <Picker.Item label="Select a subject" value="" />
//                     {subjects.map(subject => (
//                         <Picker.Item key={subject._id} label={subject.name} value={subject._id} />
//                     ))}
//                 </Picker>
//             </View>

//             <View style={styles.questionsContainer}>
//                 <Text style={styles.subHeader}>Questions</Text>
//                 {questions.length > 0 ? (
//                     <FlatList
//                         data={questions}
//                         keyExtractor={(item) => item._id}
//                         renderItem={({ item }) => (
//                             <View style={styles.questionCard}>
//                                 <Text>{item.questionText || 'No question text available'}</Text>
//                                 {item.questionImage && (
//                                     <Image source={{ uri: item.questionImage.url }} style={styles.image} />
//                                 )}
//                                 <Text>{item.answerText || 'No answer text available'}</Text>
//                                 {item.answerImage && (
//                                     <Image source={{ uri: item.answerImage.url }} style={styles.image} />
//                                 )}
//                                 {item.videoUrl && (
//                                     <TouchableOpacity style={styles.button} onPress={() => handleViewVideoSolution(item.videoUrl)}>
//                                         <Text style={styles.buttonText}>View Video Solution</Text>
//                                     </TouchableOpacity>
//                                 )}
//                             </View>
//                         )}
//                     />
//                 ) : (
//                     <Text>No questions available for the selected options.</Text>
//                 )}
//             </View>

//             {/* Modal for video solution */}
//             <Modal
//                 transparent={true}
//                 visible={modalVisible}
//                 animationType="slide"
//                 onRequestClose={handleCloseModal}
//             >
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalContent}>
//                         {videoUrl && (
//                             <WebView
//                                 source={{ uri: `https://player.vimeo.com/video/${videoUrl.split('/').pop()}` }}
//                                 style={styles.video}
//                                 allowsInlineMediaPlayback
//                             />
//                         )}
//                         <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
//                             <Text style={styles.closeButtonText}>Close</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//         backgroundColor: '#fff',
//     },
//     header: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 16,
//     },
//     pickerContainer: {
//         marginBottom: 16,
//     },
//     picker: {
//         height: 50,
//         width: '100%',
//     },
//     questionsContainer: {
//         flex: 1,
//     },
//     subHeader: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 8,
//     },
//     questionCard: {
//         marginBottom: 16,
//     },
//     image: {
//         width: '100%',
//         height: 200,
//         resizeMode: 'cover',
//         marginVertical: 8,
//     },
//     button: {
//         marginTop: 8,
//         padding: 10,
//         backgroundColor: '#007bff',
//         borderRadius: 5,
//     },
//     buttonText: {
//         color: '#fff',
//         textAlign: 'center',
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalContent: {
//         width: '90%',
//         height: '80%',
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         overflow: 'hidden',
//     },
//     video: {
//         flex: 1,
//     },
//     closeButton: {
//         padding: 10,
//         backgroundColor: '#007bff',
//         borderRadius: 5,
//         margin: 10,
//     },
//     closeButtonText: {
//         color: '#fff',
//         textAlign: 'center',
//     },
// });

// export default CourseAccess;
// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, FlatList, StyleSheet, Alert, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { WebView } from 'react-native-webview'; // Import WebView

// const CourseAccess = () => {
//     const [courses, setCourses] = useState<any[]>([]);
//     const [selectedCourse, setSelectedCourse] = useState<string>('');
//     const [years, setYears] = useState<any[]>([]);
//     const [selectedYear, setSelectedYear] = useState<string>('');
//     const [subjects, setSubjects] = useState<any[]>([]);
//     const [selectedSubject, setSelectedSubject] = useState<string>('');
//     const [questions, setQuestions] = useState<CommentType[]>([]);
//     const [videoUrl, setVideoUrl] = useState<string | null>(null);
//     const [modalVisible, setModalVisible] = useState<boolean>(false);
//     const [loading, setLoading] = useState<boolean>(false);

//     // Fetch courses
//     useEffect(() => {
//         console.log('Fetching courses...');
//         setLoading(true);
//         fetch('http://192.168.29.88:8000/api/v1/get-courses')
//             .then(response => response.json())
//             .then(data => {
//                 if (data.success) {
//                     setCourses(data.courses || []);
//                 } else {
//                     Alert.alert('Error', 'Failed to fetch courses.');
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching courses:', error);
//                 Alert.alert('Error', 'Error fetching courses.');
//             })
//             .finally(() => setLoading(false));
//     }, []);

//     // Fetch years when a course is selected
//     useEffect(() => {
//         if (selectedCourse) {
//             setLoading(true);
//             fetch(`http://192.168.29.88:8000/api/v1/course/${selectedCourse}/years`)
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.success) {
//                         setYears(data.years || []);
//                     } else {
//                         Alert.alert('Error', 'Failed to fetch years.');
//                     }
//                 })
//                 .catch(() => Alert.alert('Error', 'Error fetching years.'))
//                 .finally(() => setLoading(false));
//         } else {
//             setYears([]);
//             setSubjects([]);
//             setQuestions([]);
//         }
//     }, [selectedCourse]);

//     // Fetch subjects when a year is selected
//     useEffect(() => {
//         if (selectedYear && selectedCourse) {
//             setLoading(true);
//             fetch(`http://192.168.29.88:8000/api/v1/course/${selectedCourse}/year/${selectedYear}/subjects`)
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.success) {
//                         setSubjects(data.subjects || []);
//                     } else {
//                         Alert.alert('Error', 'Failed to fetch subjects.');
//                     }
//                 })
//                 .catch(() => Alert.alert('Error', 'Error fetching subjects.'))
//                 .finally(() => setLoading(false));
//         } else {
//             setSubjects([]);
//             setQuestions([]);
//         }
//     }, [selectedYear, selectedCourse]);

//     // Fetch questions when a subject is selected
//     useEffect(() => {
//         if (selectedSubject && selectedYear && selectedCourse) {
//             setLoading(true);
//             fetch(`http://192.168.29.88:8000/api/v1/course/${selectedCourse}/year/${selectedYear}/subject/${selectedSubject}/questions`)
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.success) {
//                         setQuestions(data.questions || []);
//                     } else {
//                         Alert.alert('Error', 'Failed to fetch questions.');
//                     }
//                 })
//                 .catch(() => Alert.alert('Error', 'Error fetching questions.'))
//                 .finally(() => setLoading(false));
//         } else {
//             setQuestions([]);
//         }
//     }, [selectedSubject, selectedYear, selectedCourse]);

//     const handleCloseModal = () => {
//         setModalVisible(false);
//         setVideoUrl(null);
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.header}>Select Your Course</Text>

//             {loading ? (
//                 <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
//             ) : (
//                 <>
//                     <View style={styles.pickerContainer}>
//                         <Text>Course:</Text>
//                         <Picker
//                             selectedValue={selectedCourse}
//                             onValueChange={(itemValue) => setSelectedCourse(itemValue)}
//                             style={styles.picker}
//                         >
//                             <Picker.Item label="Select a course" value="" />
//                             {courses.map(course => (
//                                 <Picker.Item key={course._id} label={`${course.name} (${course.tags})`} value={course._id} />
//                             ))}
//                         </Picker>
//                     </View>

//                     <View style={styles.pickerContainer}>
//                         <Text>Year:</Text>
//                         <Picker
//                             selectedValue={selectedYear}
//                             onValueChange={(itemValue) => setSelectedYear(itemValue)}
//                             style={styles.picker}
//                             enabled={!!selectedCourse}
//                         >
//                             <Picker.Item label="Select a year" value="" />
//                             {years.length > 0 ? (
//                                 years.map(year => (
//                                     <Picker.Item key={year._id} label={year.year} value={year._id} />
//                                 ))
//                             ) : (
//                                 <Picker.Item label="No years available" value="" />
//                             )}
//                         </Picker>
//                     </View>

//                     <View style={styles.pickerContainer}>
//                         <Text>Subject:</Text>
//                         <Picker
//                             selectedValue={selectedSubject}
//                             onValueChange={(itemValue) => setSelectedSubject(itemValue)}
//                             style={styles.picker}
//                             enabled={!!selectedYear}
//                         >
//                             <Picker.Item label="Select a subject" value="" />
//                             {subjects.map(subject => (
//                                 <Picker.Item key={subject._id} label={subject.name} value={subject._id} />
//                             ))}
//                         </Picker>
//                     </View>

//                     <View style={styles.questionsContainer}>
//                         <Text style={styles.subHeader}>Questions</Text>
//                         {questions.length > 0 ? (
//                             <FlatList
//                                 data={questions}
//                                 keyExtractor={(item) => item._id}
//                                 renderItem={({ item }) => (
//                                     <View style={styles.questionCard}>
//                                         <Text>{item.questionText || 'No question text available'}</Text>
//                                         {item.questionImage && (
//                                             <Image source={{ uri: item.questionImage.url }} style={styles.image} />
//                                         )}
//                                         <Text>{item.answerText || 'No answer text available'}</Text>
//                                         {item.answerImage && (
//                                             <Image source={{ uri: item.answerImage.url }} style={styles.image} />
//                                         )}
//                                         {item.videoUrl && (
//                                             <WebView
//                                                 source={{ uri: `https://player.vimeo.com/video/${item.videoUrl.split('/').pop()}` }}
//                                                 style={styles.video}
//                                                 allowsInlineMediaPlayback
//                                             />
//                                         )}
//                                     </View>
//                                 )}
//                             />
//                         ) : (
//                             <Text>No questions available for the selected options.</Text>
//                         )}
//                     </View>
//                 </>
//             )}

//             {/* Modal for video solution */}
//             <Modal
//                 transparent={true}
//                 visible={modalVisible}
//                 animationType="slide"
//                 onRequestClose={handleCloseModal}
//             >
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalContent}>
//                         {videoUrl && (
//                             <WebView
//                                 source={{ uri: `https://player.vimeo.com/video/${videoUrl.split('/').pop()}` }}
//                                 style={styles.video}
//                                 allowsInlineMediaPlayback
//                             />
//                         )}
//                         <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
//                             <Text style={styles.closeButtonText}>Close</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//         backgroundColor: '#fff',
//     },
//     header: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 16,
//     },
//     pickerContainer: {
//         marginBottom: 16,
//     },
//     picker: {
//         height: 50,
//         width: '100%',
//     },
//     questionsContainer: {
//         flex: 1,
//     },
//     subHeader: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 8,
//     },
//     questionCard: {
//         marginBottom: 16,
//     },
//     image: {
//         width: '100%',
//         height: 200,
//         resizeMode: 'cover',
//         marginVertical: 8,
//     },
//     video: {
//         flex: 1,
//         height: 300,
//     },
//     loader: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalContent: {
//         width: '90%',
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         overflow: 'hidden',
//         padding: 16,
//     },
//     closeButton: {
//         marginTop: 16,
//         backgroundColor: '#007bff',
//         padding: 10,
//         borderRadius: 5,
//         alignItems: 'center',
//     },
//     closeButtonText: {
//         color: '#fff',
//         fontWeight: 'bold',
//     },
// });

// export default CourseAccess;
import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Alert, Modal, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { WebView } from 'react-native-webview'; // Import WebView

const CourseAccess = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [years, setYears] = useState<any[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [questions, setQuestions] = useState<CommentType[]>([]);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch courses
    useEffect(() => {
        console.log('Fetching courses...');
        setLoading(true);
        fetch('http://192.168.29.88:8000/api/v1/get-courses')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setCourses(data.courses || []);
                } else {
                    Alert.alert('Error', 'Failed to fetch courses.');
                }
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
                Alert.alert('Error', 'Error fetching courses.');
            })
            .finally(() => setLoading(false));
    }, []);

    // Fetch years when a course is selected
    useEffect(() => {
        if (selectedCourse) {
            setLoading(true);
            fetch(`http://192.168.29.88:8000/api/v1/course/${selectedCourse}/years`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setYears(data.years || []);
                    } else {
                        Alert.alert('Error', 'Failed to fetch years.');
                    }
                })
                .catch(() => Alert.alert('Error', 'Error fetching years.'))
                .finally(() => setLoading(false));
        } else {
            setYears([]);
            setSubjects([]);
            setQuestions([]);
        }
    }, [selectedCourse]);

    // Fetch subjects when a year is selected
    useEffect(() => {
        if (selectedYear && selectedCourse) {
            setLoading(true);
            fetch(`http://192.168.29.88:8000/api/v1/course/${selectedCourse}/year/${selectedYear}/subjects`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setSubjects(data.subjects || []);
                    } else {
                        Alert.alert('Error', 'Failed to fetch subjects.');
                    }
                })
                .catch(() => Alert.alert('Error', 'Error fetching subjects.'))
                .finally(() => setLoading(false));
        } else {
            setSubjects([]);
            setQuestions([]);
        }
    }, [selectedYear, selectedCourse]);

    // Fetch questions when a subject is selected
    useEffect(() => {
        if (selectedSubject && selectedYear && selectedCourse) {
            setLoading(true);
            fetch(`http://192.168.29.88:8000/api/v1/course/${selectedCourse}/year/${selectedYear}/subject/${selectedSubject}/questions`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setQuestions(data.questions || []);
                    } else {
                        Alert.alert('Error', 'Failed to fetch questions.');
                    }
                })
                .catch(() => Alert.alert('Error', 'Error fetching questions.'))
                .finally(() => setLoading(false));
        } else {
            setQuestions([]);
        }
    }, [selectedSubject, selectedYear, selectedCourse]);

    const handleOpenModal = (url: string) => {
        setVideoUrl(url);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setVideoUrl(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select Your Course</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
            ) : (
                <>
                    <View style={styles.pickerContainer}>
                        <Text>Course:</Text>
                        <Picker
                            selectedValue={selectedCourse}
                            onValueChange={(itemValue) => setSelectedCourse(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a course" value="" />
                            {courses.map(course => (
                                <Picker.Item key={course._id} label={`${course.name} (${course.tags})`} value={course._id} />
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.pickerContainer}>
                        <Text>Year:</Text>
                        <Picker
                            selectedValue={selectedYear}
                            onValueChange={(itemValue) => setSelectedYear(itemValue)}
                            style={styles.picker}
                            enabled={!!selectedCourse}
                        >
                            <Picker.Item label="Select a year" value="" />
                            {years.length > 0 ? (
                                years.map(year => (
                                    <Picker.Item key={year._id} label={year.year} value={year._id} />
                                ))
                            ) : (
                                <Picker.Item label="No years available" value="" />
                            )}
                        </Picker>
                    </View>

                    <View style={styles.pickerContainer}>
                        <Text>Subject:</Text>
                        <Picker
                            selectedValue={selectedSubject}
                            onValueChange={(itemValue) => setSelectedSubject(itemValue)}
                            style={styles.picker}
                            enabled={!!selectedYear}
                        >
                            <Picker.Item label="Select a subject" value="" />
                            {subjects.map(subject => (
                                <Picker.Item key={subject._id} label={subject.name} value={subject._id} />
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.questionsContainer}>
                        <Text style={styles.subHeader}>Questions</Text>
                        {questions.length > 0 ? (
                            <FlatList
                                data={questions}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => (
                                    <View style={styles.questionCard}>
                                        <Text>{item.questionText || 'No question text available'}</Text>
                                        {item.questionImage && (
                                            <Image source={{ uri: item.questionImage.url }} style={styles.image} />
                                        )}
                                        <Text>{item.answerText || 'No answer text available'}</Text>
                                        {item.answerImage && (
                                            <Image source={{ uri: item.answerImage.url }} style={styles.image} />
                                        )}
                                        {item.videoUrl && (
                                            <TouchableOpacity onPress={() => handleOpenModal(item.videoUrl)}>
                                                <Text style={styles.videoButton}>Watch Video</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                            />
                        ) : (
                            <Text>No questions available for the selected options.</Text>
                        )}
                    </View>
                </>
            )}

            {/* Modal for video solution */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {videoUrl && (
                            <WebView
                                source={{ uri: `https://player.vimeo.com/video/${videoUrl.split('/').pop()}` }}
                                style={styles.video}
                                allowsInlineMediaPlayback
                            />
                        )}
                        <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    pickerContainer: {
        marginBottom: 16,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    questionsContainer: {
        flex: 1,
    },
    subHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    questionCard: {
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginVertical: 8,
    },
    video: {
        flex: 1,
        height: 200,
    },
    videoButton: {
        color: '#007bff',
        marginTop: 8,
    },
    loader: {
        marginTop: 50,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
    },
    closeButton: {
        marginTop: 16,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 4,
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default CourseAccess;
