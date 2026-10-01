import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProfileBanner from "../Components/dashboard/ProfileBanner";
import UpcomingTickets from "../Components/dashboard/UpcomingTickets";
import MySchedule from "../Components/dashboard/MySchedule";
import NetworkingHub from "../Components/dashboard/NetworkingHub";
import CertificatesDocuments from "../Components/dashboard/CertificatesDocuments";
import AccountMenu from "../Components/dashboard/AccountMenu";
import OrganizerEvents from "../Components/dashboard/OrganizerEvents";
import EditProfileModal from "../Components/dashboard/EditProfileModal";
import PaymentMethodsModal from "../Components/dashboard/PaymentMethodsModal";
import NotificationPreferencesModal from "../Components/dashboard/NotificationPreferencesModal";
import { scheduleItems, networkingData, documents } from "../data/mockEvents";
import { useAuth } from "../context/AuthContext";

function MyEventsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Modal states
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Attendee ke purchased tickets fetch karo
  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const { data } = await axios.get("/api/tickets/mine");
        const mappedTickets = data.map((t) => ({
          id: t._id,
          ticketId: `TK-${String(t._id).slice(-5).toUpperCase()}`,
          title: t.event?.title || "Unknown Event",
          category: t.event?.tags?.[0] || "EVENT",
          accessType: t.ticketType,
          date: `${t.event?.startDate || "TBA"} ${t.event?.startTime || ""}`,
          location: t.event?.venue || "Location TBA",
          image:
            t.event?.previewImage ||
            "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop",
        }));
        setTickets(mappedTickets);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      }
    };
    if (user) fetchMyTickets();
  }, [user]);

  // Organizer ke apne events fetch karo
  const fetchMyEvents = useCallback(async () => {
    if (user?.role !== "organizer") return;
    setEventsLoading(true);
    try {
      const { data } = await axios.get("/api/events/mine/all");
      setMyEvents(data);
    } catch (error) {
      console.error("Failed to fetch my events", error);
    } finally {
      setEventsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  // Event delete handler
  const handleDeleteEvent = async (eventId, eventTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${eventTitle}"?\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/events/${eventId}`);
      toast.success("Event deleted successfully.");
      setMyEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete event.");
    }
  };

  // Event edit handler
  const handleEditEvent = (event) => {
    navigate(`/organize/edit/${event._id}`, { state: { event } });
  };

  const profileUser = {
    name: user?.name || "Guest",
    membership: user?.role === "organizer" ? "Organizer Account" : "Member",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "Guest"
    )}&background=8C6B45&color=fff&size=128`,
  };

  return (
    <div className="bg-[#FDF6EC] min-h-screen">
      <ProfileBanner user={profileUser} onEditProfile={() => setShowEditProfile(true)} />

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {/* Organizer section */}
          {user?.role === "organizer" && (
            <OrganizerEvents
              events={myEvents}
              loading={eventsLoading}
              onDelete={handleDeleteEvent}
              onEdit={handleEditEvent}
            />
          )}

          {user?.role === "attendee" && (
            <>
              <UpcomingTickets tickets={tickets} />
              <MySchedule scheduleItems={scheduleItems} />
            </>
          )}
        </div>

        <div className="space-y-6">
          {user?.role === "attendee" && (
            <>
              <NetworkingHub data={networkingData} />
              <CertificatesDocuments documents={documents} />
            </>
          )}

          {/* Account Menu — all 3 buttons functional */}
          <AccountMenu
            onEditProfile={() => setShowEditProfile(true)}
            onPaymentClick={() => setShowPaymentModal(true)}
            onNotificationClick={() => setShowNotificationModal(true)}
          />
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal onClose={() => setShowEditProfile(false)} />
      )}

      {/* Payment Methods Modal */}
      {showPaymentModal && (
        <PaymentMethodsModal onClose={() => setShowPaymentModal(false)} />
      )}

      {/* Notification Preferences Modal */}
      {showNotificationModal && (
        <NotificationPreferencesModal onClose={() => setShowNotificationModal(false)} />
      )}
    </div>
  );
}

export default MyEventsPage;
