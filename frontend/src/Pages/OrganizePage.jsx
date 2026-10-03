import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Save, Eye, Rocket, ArrowLeft } from "lucide-react";
import StepperBar from "../Components/organize/StepperBar";
import FoundationSection from "../Components/organize/FoundationSection";
import ConciergeChecklist from "../Components/organize/ConciergeChecklist";
import TemporalBlueprint from "../Components/organize/TemporalBlueprint";
import DestinationSection from "../Components/organize/DestinationSection";
import LivePreviewSidebar from "../Components/organize/LivePreviewSidebar";
import ImageUploader from "../Components/organize/ImageUploader";
import MultipleImageUploader from "../Components/organize/MultipleImageUploader";
import { organizeDefaults } from "../data/mockEvents";

const DRAFT_KEY = "organizeDraft";

function OrganizePage() {
  const navigate = useNavigate();
  const { eventId } = useParams();        // edit mode: /organize/edit/:eventId
  const location = useLocation();
  const isEditMode = Boolean(eventId);    // true = edit existing, false = create new

  const [eventData, setEventData] = useState({ ...organizeDefaults });
  const [errors, setErrors] = useState([]);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (isEditMode) {
      // Edit mode — location.state se event data lo (MyEventsPage se pass kiya tha)
      // Ya agar direct URL pe aaye toh API se fetch karo
      const stateEvent = location.state?.event;
      if (stateEvent) {
        setEventData({
          title: stateEvent.title || "",
          synopsis: stateEvent.synopsis || "",
          category: stateEvent.category || "",
          price: stateEvent.price ?? "",
          tags: stateEvent.tags || [],
          startDate: stateEvent.startDate || "",
          startTime: stateEvent.startTime || "",
          endDate: stateEvent.endDate || "",
          endTime: stateEvent.endTime || "",
          timezone: stateEvent.timezone || "",
          format: stateEvent.format || "In-Person",
          venue: stateEvent.venue || "",
          address: stateEvent.address || "",
          streamUrl: stateEvent.streamUrl || "",
          previewImage: stateEvent.previewImage || "",
          qualityScore: stateEvent.qualityScore || 0,
          selectedTier: stateEvent.selectedTier || "",
          tierDetails: stateEvent.tierDetails || "",
          agenda: stateEvent.agenda || "",
          promoVideo: stateEvent.promoVideo || "",
          privacy: stateEvent.privacy || "Public",
          galleryImages: stateEvent.galleryImages || [],
        });
      } else {
        // Direct URL navigation — API se fetch karo
        axiosInstance.get(`/api/events/${eventId}`)
          .then(({ data }) => {
            setEventData({
              title: data.title || "",
              synopsis: data.synopsis || "",
              category: data.category || "",
              price: data.price ?? "",
              tags: data.tags || [],
              startDate: data.startDate || "",
              startTime: data.startTime || "",
              endDate: data.endDate || "",
              endTime: data.endTime || "",
              timezone: data.timezone || "",
              format: data.format || "In-Person",
              venue: data.venue || "",
              address: data.address || "",
              streamUrl: data.streamUrl || "",
              previewImage: data.previewImage || "",
              qualityScore: data.qualityScore || 0,
              selectedTier: data.selectedTier || "",
              tierDetails: data.tierDetails || "",
              agenda: data.agenda || "",
              promoVideo: data.promoVideo || "",
              privacy: data.privacy || "Public",
              galleryImages: data.galleryImages || [],
            });
          })
          .catch(() => {
            toast.error("Failed to load event data.");
            navigate("/my-events");
          });
      }
    } else {
      // Create mode — draft load karo
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        setEventData(JSON.parse(savedDraft));
      }
    }
  }, [isEditMode, eventId, location.state, navigate]);

  
  const validateStep = (step) => {
    const issues = [];
    if (step === 1) {
      if (!eventData.title?.trim()) issues.push("Event Title is required.");
      if (!eventData.category?.trim()) issues.push("Event Category is required.");
      if (eventData.price === "" || eventData.price === null || eventData.price === undefined) {
        issues.push("Ticket price is required (enter 0 for free events).");
      }
      if (!eventData.synopsis?.trim()) issues.push("Editorial Synopsis is required.");
      if (!eventData.startDate?.trim()) issues.push("Start Date is required.");
      if (!eventData.venue?.trim()) issues.push("Venue is required.");
    }
    if (step === 2) {
      if (!eventData.selectedTier?.trim()) issues.push("Please select an Admission Tier in Step 2.");
      if (!eventData.tierDetails?.trim()) issues.push("Please provide Tier Details in Step 2.");
    }
    if (step === 3) {
      if (!eventData.agenda?.trim()) issues.push("Please provide an Event Agenda in Step 3.");
    }
    return issues;
  };


  const handleSaveDraft = () => {
    if (isEditMode) {
      toast("Draft saving is not available in edit mode.", { icon: "ℹ️" });
      return;
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(eventData));
    setErrors([]);
    toast.success("Draft saved successfully.");
  };

  const handlePreview = () => {
    document.getElementById("live-preview")?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePublish = async () => {
    let allIssues = [];
    let firstErrorStep = null;

    for (let i = 1; i <= 5; i++) {
      const stepIssues = validateStep(i);
      if (stepIssues.length > 0) {
        allIssues = [...allIssues, ...stepIssues];
        if (!firstErrorStep) firstErrorStep = i;
      }
    }
    
    if (allIssues.length > 0) {
      setErrors(allIssues);
      if (firstErrorStep !== activeStep) {
        setActiveStep(firstErrorStep);
      }
      toast.error("Please fix the issues below before publishing.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      toast.loading(isEditMode ? "Saving changes..." : "Publishing event...", { id: "publish-toast" });

      const payload = {
        title: eventData.title,
        synopsis: eventData.synopsis,
        category: eventData.category,
        price: Number(eventData.price) || 0,
        tags: eventData.tags || [],
        startDate: eventData.startDate,
        startTime: eventData.startTime,
        endDate: eventData.endDate,
        endTime: eventData.endTime,
        timezone: eventData.timezone,
        format: eventData.format,
        venue: eventData.venue,
        address: eventData.address,
        streamUrl: eventData.streamUrl,
        previewImage: eventData.previewImage,
        selectedTier: eventData.selectedTier,
        tierDetails: eventData.tierDetails,
        agenda: eventData.agenda,
        promoVideo: eventData.promoVideo,
        privacy: eventData.privacy,
        galleryImages: eventData.galleryImages || [],
      };

      if (isEditMode) {
        // ✅ Edit mode — PUT request
        await axiosInstance.put(`/api/events/${eventId}`, payload);
        toast.success("Event updated successfully!", { id: "publish-toast" });
      } else {
        // ✅ Create mode — POST request
        await axiosInstance.post("/api/events", payload);
        localStorage.removeItem(DRAFT_KEY); // draft clear karo
        toast.success("Event published successfully!", { id: "publish-toast" });
      }

      setErrors([]);
      setTimeout(() => navigate("/my-events"), 1500);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Failed to publish event to the server.";
      setErrors([errorMsg]);
      toast.error(errorMsg, { id: "publish-toast" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#FBF3EC] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top bar — badge + title + action buttons */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#b8862f]/10 text-[#b8862f] text-[10px] font-bold tracking-[0.15em] rounded-full uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b8862f]" />
                Curator Suite • Gala Edition
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-[#2d1a0e] italic">
              {isEditMode ? "Edit Occasion" : "Curate An Occasion"}
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {isEditMode && (
              <button
                onClick={() => navigate("/my-events")}
                className="flex items-center gap-2 px-4 py-2.5 border border-[#d5ccc3] text-[#3d2a2a] rounded-full text-xs font-semibold hover:bg-white transition-colors"
              >
                <ArrowLeft size={14} />
                Cancel
              </button>
            )}
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#d5ccc3] text-[#3d2a2a] rounded-full text-xs font-semibold hover:bg-white transition-colors"
            >
              <Save size={14} />
              Save Draft
            </button>
            <button
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#d5ccc3] text-[#3d2a2a] rounded-full text-xs font-semibold hover:bg-white transition-colors"
            >
              <Eye size={14} />
              Preview Event
            </button>
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#8b2d3a] text-white rounded-full text-xs font-semibold hover:bg-[#6d2330] transition-colors shadow-md"
            >
              <Rocket size={14} />
              {isEditMode ? "Save Changes" : "Publish Event"}
            </button>
          </div>
        </div>

        {/* Validation errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-red-700 mb-1">Please fix the following:</p>
            <ul className="list-disc list-inside text-sm text-red-600 space-y-0.5">
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#e8e0d8] px-8 py-6 mb-8">
          <StepperBar activeStep={activeStep} onStepClick={(step) => {
              if (step < activeStep) {
                setErrors([]);
                setActiveStep(step);
              } else {
                let canJump = true;
                // Check ALL steps from 1 up to the step they want to jump to
                for (let i = 1; i < step; i++) {
                  const stepIssues = validateStep(i);
                  if (stepIssues.length > 0) {
                    setErrors(stepIssues);
                    toast.error(`Please complete Step ${i} before proceeding.`);
                    canJump = false;
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    
                    // Automatically navigate to the step that has issues
                    if (activeStep !== i) setActiveStep(i);
                    break;
                  }
                }
                if (canJump) {
                  setErrors([]);
                  setActiveStep(step);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }
            }} />
        </div>

        {/* Main content — two column layout */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left — Form sections */}
          <div className="flex-1 min-w-0">
            
              {/* STEP 1: BASICS */}
              {activeStep === 1 && (
                <>
                  <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    <div className="flex-1">
                      <FoundationSection eventData={eventData} setEventData={setEventData} />
                    </div>
                    <div className="w-full lg:w-72 shrink-0">
                      <ConciergeChecklist qualityScore={eventData.qualityScore} />
                    </div>
                  </div>

                  <div className="mb-8">
                    <TemporalBlueprint eventData={eventData} setEventData={setEventData} />
                  </div>

                  <div className="mb-8">
                    <DestinationSection eventData={eventData} setEventData={setEventData} />
                  </div>

                  {/* Image Upload Section */}
                  <div className="mb-8 bg-white rounded-2xl border border-[#e8e0d8] p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold tracking-[0.2em] text-[#b8862f] uppercase">
                        04 / Event Image
                      </h3>
                      <span className="text-xs text-[#a09080] italic">Cover Photo</span>
                    </div>
                    <ImageUploader
                      value={eventData.previewImage}
                      onChange={(url) => setEventData((prev) => ({ ...prev, previewImage: url }))}
                    />
                  </div>
                </>
              )}

              
              {/* STEP 2: TICKETING */}
              {activeStep === 2 && (
                <div className="bg-white rounded-2xl border border-[#e8e0d8] p-8 mb-8">
                  <div className="mb-6">
                    <h3 className="text-xs font-bold tracking-[0.2em] text-[#b8862f] uppercase mb-1">
                      02 / Ticketing & Tiers
                    </h3>
                    <p className="text-sm text-[#7a6a6a]">Define the admission tiers and capacity for your event.</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-[#3d2a2a] mb-2">Primary Admission Tier</label>
                      <select 
                        value={eventData.selectedTier || ""}
                        onChange={(e) => setEventData(prev => ({ ...prev, selectedTier: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#FBF3EC] border border-[#e8e0d8] rounded-xl text-sm focus:outline-none focus:border-[#b8862f]"
                      >
                        <option value="">Select Tier Type...</option>
                        <option value="General Admission">General Admission</option>
                        <option value="VIP Access">VIP Access</option>
                        <option value="All Access Pass">All Access Pass</option>
                        <option value="Donation / Pay What You Want">Donation / Pay What You Want</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#3d2a2a] mb-2">Tier Details & Perks</label>
                      <textarea 
                        value={eventData.tierDetails || ""}
                        onChange={(e) => setEventData(prev => ({ ...prev, tierDetails: e.target.value }))}
                        placeholder="E.g., VIP includes front-row seating and access to the exclusive lounge..."
                        rows={4}
                        className="w-full px-4 py-3 bg-[#FBF3EC] border border-[#e8e0d8] rounded-xl text-sm focus:outline-none focus:border-[#b8862f] resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: AGENDA */}
              {activeStep === 3 && (
                <div className="bg-white rounded-2xl border border-[#e8e0d8] p-8 mb-8">
                  <div className="mb-6">
                    <h3 className="text-xs font-bold tracking-[0.2em] text-[#b8862f] uppercase mb-1">
                      03 / Event Agenda
                    </h3>
                    <p className="text-sm text-[#7a6a6a]">Outline the schedule or timeline for your attendees.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#3d2a2a] mb-2">Schedule / Timeline</label>
                    <textarea 
                      value={eventData.agenda || ""}
                      onChange={(e) => setEventData(prev => ({ ...prev, agenda: e.target.value }))}
                      placeholder="10:00 AM - Doors Open&#10;11:00 AM - Keynote Speech&#10;01:00 PM - Lunch Break..."
                      rows={8}
                      className="w-full px-4 py-3 bg-[#FBF3EC] border border-[#e8e0d8] rounded-xl text-sm focus:outline-none focus:border-[#b8862f]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: MEDIA */}
              {activeStep === 4 && (
                <div className="bg-white rounded-2xl border border-[#e8e0d8] p-8 mb-8">
                  <div className="mb-6">
                    <h3 className="text-xs font-bold tracking-[0.2em] text-[#b8862f] uppercase mb-1">
                      04 / Visuals & Brand Assets
                    </h3>
                    <p className="text-sm text-[#7a6a6a]">Enhance your event page with additional media.</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-[#3d2a2a] mb-2">Promotional Video URL (Optional)</label>
                      <input 
                        type="url"
                        value={eventData.promoVideo || ""}
                        onChange={(e) => setEventData(prev => ({ ...prev, promoVideo: e.target.value }))}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full px-4 py-3 bg-[#FBF3EC] border border-[#e8e0d8] rounded-xl text-sm focus:outline-none focus:border-[#b8862f]"
                      />
                    </div>
                    
                    <div className="bg-white">
                      <p className="text-sm font-bold text-[#3d2a2a] mb-2">Additional Gallery Images</p>
                      <MultipleImageUploader
                        values={eventData.galleryImages}
                        onChange={(urls) => setEventData((prev) => ({ ...prev, galleryImages: urls }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: PUBLISH */}
              {activeStep === 5 && (
                <div className="bg-white rounded-2xl border border-[#e8e0d8] p-8 mb-8">
                  <div className="mb-6">
                    <h3 className="text-xs font-bold tracking-[0.2em] text-[#b8862f] uppercase mb-1">
                      05 / Privacy & Launch
                    </h3>
                    <p className="text-sm text-[#7a6a6a]">Final settings before your event goes live.</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-[#3d2a2a] mb-2">Event Privacy</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setEventData(prev => ({ ...prev, privacy: "Public" }))}
                          className={`p-4 border rounded-xl text-left transition-all ${eventData.privacy === 'Public' || !eventData.privacy ? 'border-[#b8862f] bg-[#b8862f]/5 ring-1 ring-[#b8862f]' : 'border-[#e8e0d8] hover:border-[#d5ccc3] bg-white'}`}
                        >
                          <p className="font-bold text-[#3d2a2a] text-sm mb-1">Public Event</p>
                          <p className="text-xs text-[#7a6a6a]">Listed on LuxeEvents discovery page. Anyone can see and register.</p>
                        </button>
                        <button 
                          onClick={() => setEventData(prev => ({ ...prev, privacy: "Private" }))}
                          className={`p-4 border rounded-xl text-left transition-all ${eventData.privacy === 'Private' ? 'border-[#b8862f] bg-[#b8862f]/5 ring-1 ring-[#b8862f]' : 'border-[#e8e0d8] hover:border-[#d5ccc3] bg-white'}`}
                        >
                          <p className="font-bold text-[#3d2a2a] text-sm mb-1">Private / Invite-Only</p>
                          <p className="text-xs text-[#7a6a6a]">Hidden from search. Only people with the direct link can view it.</p>
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-[#f9faeb] border border-[#e5ecb7] rounded-xl flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#d0db7d] flex items-center justify-center shrink-0 text-[#4c5421] font-bold">
                        ✓
                      </div>
                      <div>
                        <p className="font-bold text-[#4c5421] text-sm mb-1">Ready for Launch!</p>
                        <p className="text-xs text-[#6a7536]">Your event passes all quality checks. Hit the publish button below to make it live.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="flex items-center justify-between mt-4 mb-8 border-t border-[#e8e0d8] pt-8">
                <button
                  onClick={() => {
                    setActiveStep((prev) => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={activeStep === 1}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${activeStep === 1 ? 'opacity-50 cursor-not-allowed bg-white border border-[#e8e0d8] text-gray-400' : 'bg-white border border-[#d5ccc3] text-[#3d2a2a] hover:bg-gray-50'}`}
                >
                  Back
                </button>
                
                {activeStep < 5 ? (
                  <button
                    onClick={() => {
                      const issues = validateStep(activeStep);
                      if (issues.length > 0) {
                        setErrors(issues);
                        toast.error("Please fill required fields before proceeding.");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        return;
                      }
                      setErrors([]);
                      setActiveStep((prev) => Math.min(5, prev + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-2.5 rounded-full text-sm font-semibold bg-[#3d2a2a] text-white hover:bg-[#2c1a1a] transition-colors shadow-sm"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={handlePublish}
                    className="flex items-center gap-2 px-8 py-2.5 bg-[#8b2d3a] text-white rounded-full text-sm font-bold hover:bg-[#6d2330] transition-colors shadow-md"
                  >
                    <Rocket size={16} />
                    {isEditMode ? 'Save Changes' : 'Publish Event'}
                  </button>
                )}
              </div>

          </div>

          {/* Right — Live Preview Sidebar */}
          <div id="live-preview" className="w-full xl:w-80 shrink-0">
            <div className="xl:sticky xl:top-24">
              <LivePreviewSidebar eventData={eventData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizePage;