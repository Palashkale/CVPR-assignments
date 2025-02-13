import { Activity, Heart, Shield, Stethoscope } from 'lucide-react';
import Scene3D from '../components/Scene3D';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                AI-Powered Health Insurance Assistant
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Get personalized insurance recommendations using advanced AI technology. We analyze your health profile to find the perfect coverage for your needs.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Activity className="h-6 w-6 text-indigo-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Smart Analysis</h3>
                    <p className="text-gray-600">Advanced AI analysis of your health profile</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="h-6 w-6 text-indigo-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Personalized Care</h3>
                    <p className="text-gray-600">Tailored recommendations for your needs</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Stethoscope className="h-6 w-6 text-indigo-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Expert Guidance</h3>
                    <p className="text-gray-600">Professional healthcare insights</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Scene3D />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Create Profile</h3>
              <p className="text-gray-600">Sign up and provide your health information</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">AI Analysis</h3>
              <p className="text-gray-600">Our AI analyzes your health profile</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Get Recommendations</h3>
              <p className="text-gray-600">Receive personalized insurance plans</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}