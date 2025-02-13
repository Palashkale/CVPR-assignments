import React from 'react';
import { InsurancePlan } from '../types';
import { Check } from 'lucide-react';

interface RecommendedPlansProps {
  plans: InsurancePlan[];
}

const RecommendedPlans: React.FC<RecommendedPlansProps> = ({ plans }) => {
  if (!plans || plans.length === 0) {
    return <div>No recommendations available.</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Recommended Insurance Plans
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {plan.name}
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold text-indigo-600">
                  ${plan.monthlyPremium}
                  <span className="text-sm text-gray-500">/month</span>
                </p>
                <p className="text-sm text-gray-500">
                  ${plan.deductible} deductible
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Coverage:</h4>
                <ul className="space-y-2">
                  {plan.coverage.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-gray-600">{plan.description}</p>
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                Select Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedPlans;