// Pantallas que se abren ENCIMA de las pestañas con navigate('Nombre', params)
import RegisterScreen from '../screens/auth/RegisterScreen';
import JobDetailScreen from '../screens/shared/JobDetailScreen';
import ApplicationDetailScreen from '../screens/shared/ApplicationDetailScreen';
import CandidateProfileScreen from '../screens/shared/CandidateProfileScreen';
import EditProfileScreen from '../screens/candidate/EditProfileScreen';
import SkillsScreen from '../screens/candidate/SkillsScreen';
import DocumentsScreen from '../screens/candidate/DocumentsScreen';
import JobFormScreen from '../screens/recruiter/JobFormScreen';
import ReceivedApplicationsScreen from '../screens/recruiter/ReceivedApplicationsScreen';

export const routes = {
    Register: RegisterScreen,
    JobDetail: JobDetailScreen,
    ApplicationDetail: ApplicationDetailScreen,
    CandidateProfile: CandidateProfileScreen,
    EditProfile: EditProfileScreen,
    Skills: SkillsScreen,
    Documents: DocumentsScreen,
    JobForm: JobFormScreen,
    ReceivedApplications: ReceivedApplicationsScreen
};
