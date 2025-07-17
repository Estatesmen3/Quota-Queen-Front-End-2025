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
      fetchChallenges();
    } catch (error) {
      toast({
        title: "Failed to create challenge",
        description: error.response?.data?.error || error.message || error.response?.data || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid md:grid-cols-2 gap-4">
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

          <div className="grid gap-2">
            <Label htmlFor="product_name">Product Name*</Label>
            <Input
              id="product_name"
              required
              value={formData.product_name}
              onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              placeholder="e.g., Sales Cloud Enterprise"
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
          <Label htmlFor="seller_company">Seller Company</Label>
          <Textarea
            id="seller_company"
            value={formData.seller_company}
            onChange={(e) => setFormData({ ...formData, seller_company: e.target.value })}
            placeholder="Seller Company..."
            className="min-h-[80px]"
          />
        </div>


        <div className="grid gap-2">
          <Label htmlFor="seller_product">Seller Product</Label>
          <Textarea
            id="seller_product"
            value={formData.seller_product}
            onChange={(e) => setFormData({ ...formData, seller_product: e.target.value })}
            placeholder="Seller Product..."
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

        <div className="grid gap-2">
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

        <div className="grid gap-2">
          <Label htmlFor="prospect_background">Prospect Background</Label>
          <Textarea
            id="prospect_background"
            value={formData.prospect_background}
            onChange={(e) => setFormData({ ...formData, prospect_background: e.target.value })}
            placeholder="Describe who the prospect is and their role..."
            className="min-h-[80px]"
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

        {/* === Company Info Inputs === */}
        <div className="grid gap-2">
          <Label htmlFor="company_info_address">Company Address</Label>
          <Input
            id="company_info_address"
            value={formData.company_info?.address || ""}
            onChange={(e) => updateCompanyInfo("address", e.target.value)}
            placeholder="e.g., 123 Main St, San Francisco"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="company_info_phone">Company Phone</Label>
          <Input
            id="company_info_phone"
            value={formData.company_info?.phone || ""}
            onChange={(e) => updateCompanyInfo("phone", e.target.value)}
            placeholder="e.g., +1 234 567 8900"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="company_info_website">Company Website</Label>
          <Input
            id="company_info_website"
            value={formData.company_info?.website || ""}
            onChange={(e) => updateCompanyInfo("website", e.target.value)}
            placeholder="e.g., https://salesforce.com"
          />
        </div>

        {/* === Prospect Info Inputs === */}
        <div className="grid gap-2">
          <Label htmlFor="prospect_info_name">Prospect Name</Label>
          <Input
            id="prospect_info_name"
            value={formData.prospect_info?.name || ""}
            onChange={(e) => updateProspectInfo("name", e.target.value)}
            placeholder="e.g., John Doe"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="prospect_info_role">Prospect Role</Label>
          <Input
            id="prospect_info_role"
            value={formData.prospect_info?.role || ""}
            onChange={(e) => updateProspectInfo("role", e.target.value)}
            placeholder="e.g., Sales Manager"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="prospect_info_email">Prospect Email</Label>
          <Input
            id="prospect_info_email"
            type="email"
            value={formData.prospect_info?.email || ""}
            onChange={(e) => updateProspectInfo("email", e.target.value)}
            placeholder="e.g., john@example.com"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="prospect_info_phone">Prospect Phone</Label>
          <Input
            id="prospect_info_phone"
            value={formData.prospect_info?.phone || ""}
            onChange={(e) => updateProspectInfo("phone", e.target.value)}
            placeholder="e.g., +1 555 123 4567"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="prospect_info_personality">Prospect Personality</Label>
          <Input
            id="prospect_info_ personality"
            value={formData.prospect_info?.personality || ""}
            onChange={(e) => updateProspectInfo("personality", e.target.value)}
            placeholder="Prospect Personality"
          />
        </div>
        

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="industry">Industry*</Label>
            <Select
              required
              value={formData.industry}
              onValueChange={(value) => setFormData({ ...formData, industry: value })}
            >
              <SelectTrigger id="industry">
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
            <Label htmlFor="difficulty">Difficulty*</Label>
            <Select
              required
              value={formData.difficulty}
              onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
            >
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="prize_description">Prize Description</Label>
            <Input
              id="prize_description"
              value={formData.prize_description}
              onChange={(e) => setFormData({ ...formData, prize_description: e.target.value })}
              placeholder="Describe the prize or reward..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="prize_worth">Prize Worth</Label>
            <Input
              id="prize_worth"
              type="number"
              value={formData.prize_worth}
              onChange={(e) => setFormData({ ...formData, prize_worth: Number(e.target.value) })}
              placeholder="Numeric value of prize"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="additional_instructions">Additional Instructions</Label>
          <Textarea
            id="additional_instructions"
            value={formData.additional_instructions}
            onChange={(e) => setFormData({ ...formData, additional_instructions: e.target.value })}
            placeholder="Any additional instructions for students"
            className="min-h-[80px]"
          />
        </div>

        <Button type="submit">Create Challenge</Button>
      </div>
    </form>
  )
}

export default ChallengeForm