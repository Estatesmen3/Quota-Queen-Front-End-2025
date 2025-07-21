import { useAuth } from '@/context/AuthContext';

import { useToast } from "@/hooks/use-toast";
import React, { useState } from 'react'
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from 'axios';
import { supabase } from "@/lib/supabase";
import { Button } from '@/components/ui/button';
import apiClient from '../../apiClient';

const ChallengeForm = ({
  formData,
  setFormData,
  resetForm,
  fetchChallenges
}: {
  formData: any;
  setFormData: any;
  resetForm: any;
  fetchChallenges: any;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);


  const updateCompanyInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      company_info: {
        ...prev.company_info,
        [field]: value
      }
    }));
  };


  const updateProspectInfo = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      prospect_info: {
        ...prev.prospect_info,
        [field]: value
      }
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const tokenString = localStorage.getItem("sb-pesnfpdwcojfomspprmf-auth-token");
    const tokenObject = tokenString ? JSON.parse(tokenString) : null;
    const accessToken = tokenObject?.access_token;
    try {
      const response = await apiClient.post('api/challenge', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Submission successful:', response.data);
      toast({
        title: "Challenge created",
        description: response.data,
      });
      resetForm();
      window.location.href = "/recruiter/sponsored-challenges";
    } catch (error) {
      toast({
        title: "Failed to create challenge",
        description: error.response?.data?.error || error.message || error.response?.data || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">

        {/* === Buyer Information Section === */}
        <div className="bg-gray-100 p-6 rounded-lg mt-4">
          <h3 className="text-lg font-semibold mb-4">Buyer Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="buyer_name">Buyer Name</Label>
              <Input
                id="buyer_name"
                value={formData.buyer_name || ""}
                onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
                placeholder="e.g., Jane Smith"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="buyer_company">Buyer Company</Label>
              <Input
                id="buyer_company"
                value={formData.buyer_company || ""}
                onChange={(e) => setFormData({ ...formData, buyer_company: e.target.value })}
                placeholder="e.g., Acme Corp"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="buyer_designation">Buyer Designation</Label>
              <Input
                id="buyer_designation"
                value={formData.buyer_designation || ""}
                onChange={(e) => setFormData({ ...formData, buyer_designation: e.target.value })}
                placeholder="e.g., Procurement Lead"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="buyer_personality">Buyer Personality</Label>
              <Input
                id="buyer_personality"
                value={formData.buyer_personality || ""}
                onChange={(e) => setFormData({ ...formData, buyer_personality: e.target.value })}
                placeholder="e.g., Analytical, Assertive"
              />
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="buyer_industry">Buyer Industry</Label>
              <Select
                value={formData.buyer_industry || ""}
                onValueChange={(value) => setFormData({ ...formData, buyer_industry: value })}
              >
                <SelectTrigger id="buyer_industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Professional Services">Professional Services</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
            <Label htmlFor="seller_company">Seller Company</Label>
            <Input
              id="seller_company"
              value={formData.seller_company}
              onChange={(e) => setFormData({ ...formData, seller_company: e.target.value })}
              placeholder="Seller Company..."
            />
          </div>

          <div className="grid gap-2">
          <Label htmlFor="seller_product">Seller Product</Label>
          <Input
            id="seller_product"
            value={formData.seller_product}
            onChange={(e) => setFormData({ ...formData, seller_product: e.target.value })}
            placeholder="Seller Product..."
          />
        </div>

          </div>

          <div className="grid gap-2 my-3">
          <Label htmlFor="prospect_background">Prospect Background</Label>
          <Textarea
            id="prospect_background"
            value={formData.prospect_background}
            onChange={(e) => setFormData({ ...formData, prospect_background: e.target.value })}
            placeholder="Describe who the prospect is and their role..."
            className="min-h-[80px]"
          />
        </div>

          <div className="grid gap-2 my-4">
          <Label htmlFor="scenario_description">Challenges Faced by Prospect/Company*</Label>
          <Textarea
            id="scenario_description"
            required
            value={formData.scenario_description}
            onChange={(e) => setFormData({ ...formData, scenario_description: e.target.value })}
            placeholder="Describe the Challenges Faced By Prospect."
            className="min-h-[100px]"
          />
        </div>

        <div className="grid gap-2 my-2">
          <Label htmlFor="goals">Goals*</Label>
          <Textarea
            id="goals"
            required
            value={formData.goals}
            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
            placeholder="Prospect Goals"
            className="min-h-[100px]"
          />
        </div>
        </div>

        {/* === Existing Form Fields (continued) === */}
        <div className="grid gap-4 mt-3">
          <div className="grid gap-2">
            <Label htmlFor="company_name">Company Name*</Label>
            <Input
              id="company_name"
              required
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              placeholder="e.g., Salesforce"
            />
          </div>

        </div>

        <div className="grid gap-2">
          <Label htmlFor="company_description">Company Description</Label>
          <Textarea
            id="company_description"
            value={formData.company_description}
            onChange={(e) => setFormData({ ...formData, company_description: e.target.value })}
            placeholder="Briefly describe the company..."
            className="min-h-[80px]"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="scenario_title">Challenge Title*</Label>
          <Input
            id="scenario_title"
            required
            value={formData.scenario_title}
            onChange={(e) => setFormData({ ...formData, scenario_title: e.target.value })}
            placeholder="e.g., B2B SaaS Sales Pitch Challenge"
          />
        </div>


        <div className="grid gap-2">
          <Label htmlFor="research_notes">Research Notes</Label>
          <Textarea
            id="research_notes"
            value={formData.research_notes}
            onChange={(e) => setFormData({ ...formData, research_notes: e.target.value })}
            placeholder="Include notes about the prospect's company, pain points, etc."
            className="min-h-[80px]"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="call_info">Call Information</Label>
          <Textarea
            id="call_info"
            value={formData.call_info}
            onChange={(e) => setFormData({ ...formData, call_info: e.target.value })}
            placeholder="Provide context for the call (cold call, follow-up, etc.)"
            className="min-h-[80px]"
          />
        </div>

        {/* === Remaining Fields (Company Info, Prospect Info, Industry, Difficulty, etc.) === */}
        {/* Keep the rest of your form structure here as in your original post. */}

        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
              Creating Challenge...
            </>
          ) : (
            "Create Challenge"
          )}
        </Button>

      </div>
    </form>

  )
}

export default ChallengeForm