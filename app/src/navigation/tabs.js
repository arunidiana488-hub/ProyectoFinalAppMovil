// Menú inferior de cada rol: cada pestaña es una pantalla principal
import CandidateHomeScreen from '../screens/candidate/CandidateHomeScreen';
import JobsScreen from '../screens/candidate/JobsScreen';
import MyApplicationsScreen from '../screens/candidate/MyApplicationsScreen';
import ProfileScreen from '../screens/candidate/ProfileScreen';

import RecruiterHomeScreen from '../screens/recruiter/RecruiterHomeScreen';
import MyJobsScreen from '../screens/recruiter/MyJobsScreen';
import ReceivedApplicationsScreen from '../screens/recruiter/ReceivedApplicationsScreen';
import CandidatesScreen from '../screens/recruiter/CandidatesScreen';
import CompanyScreen from '../screens/recruiter/CompanyScreen';

import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import UsersScreen from '../screens/admin/UsersScreen';
import DocumentsReviewScreen from '../screens/admin/DocumentsReviewScreen';
import CompaniesScreen from '../screens/admin/CompaniesScreen';

export const tabsByRole = {
    candidate: [
        { key: 'home', label: 'Inicio', icon: 'home', component: CandidateHomeScreen },
        { key: 'jobs', label: 'Ofertas', icon: 'search', component: JobsScreen },
        { key: 'applications', label: 'Postulaciones', icon: 'paper-plane', component: MyApplicationsScreen },
        { key: 'profile', label: 'Perfil', icon: 'person', component: ProfileScreen }
    ],
    recruiter: [
        { key: 'home', label: 'Inicio', icon: 'home', component: RecruiterHomeScreen },
        { key: 'jobs', label: 'Vacantes', icon: 'briefcase', component: MyJobsScreen },
        { key: 'applications', label: 'Postulaciones', icon: 'documents', component: ReceivedApplicationsScreen },
        { key: 'candidates', label: 'Talento', icon: 'people', component: CandidatesScreen },
        { key: 'company', label: 'Empresa', icon: 'business', component: CompanyScreen }
    ],
    administrator: [
        { key: 'home', label: 'Resumen', icon: 'stats-chart', component: AdminHomeScreen },
        { key: 'users', label: 'Usuarios', icon: 'people', component: UsersScreen },
        { key: 'documents', label: 'Documentos', icon: 'document-text', component: DocumentsReviewScreen },
        { key: 'companies', label: 'Empresas', icon: 'business', component: CompaniesScreen }
    ]
};
