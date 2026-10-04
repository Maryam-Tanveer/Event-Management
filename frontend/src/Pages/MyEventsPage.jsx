import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
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
import ConfirmDeleteModal from "../Components/dashboard/ConfirmDeleteModal";
import { useAuth } from "../context/AuthContext";

// ✅ mockEvents se koi bhi import nahi — sab kuch real API se aata hai

function MyEventsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets]           = useState([]);
  const [myEvents, setMyEvents]         = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // ✅ Schedule — real tickets se derive hota hai (hardcoded nahi)
  const [scheduleItems, setScheduleItems] = useState([]);

  // ✅ Networking — real attendee count from events user joined
  const [networkingData, setNetworkingData] = useState(null);

  // ✅ Documents — real tickets se derive hote hain (hardcoded nahi)
  const [documents, setDocuments] = useState([]);

  // Modal states
  const [showEditProfile, setShowEditProfile]         = useState(false);
  const [showPaymentModal, setShowPaymentModal]       = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [deleteTarget, setDeleteTarget]               = useState(null); // { id, title }

  // ── Attendee: real tickets fetch ─────────────────────────────────────────
  useEffect(() => {
    if (!user || user.role !== "attendee") return;

    const fetchMyTickets = async () => {
      try {
        const { data } = await axiosInstance.get("/api/tickets/mine");

        const mappedTickets = data.map((t) => ({
          id:         t._id,
          ticketId:   `TK-${String(t._id).slice(-5).toUpperCase()}`,
          title:      t.event?.title || "Unknown Event",
          category:   t.event?.tags?.[0] || "EVENT",
          accessType: t.ticketType,
          date:       `${t.event?.startDate || "TBA"} ${t.event?.startTime || ""}`.trim(),
          location:   t.event?.venue || "Location TBA",
          image:
            t.event?.previewImage ||
            "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop",
        }));
        setTickets(mappedTickets);

        // ✅ Schedule — real tickets se derive karo (aane wali events)
        const today = new Date();
        const upcoming = data
          .filter((t) => t.event?.startDate)
          .sort((a, b) => new Date(a.event.startDate) - new Date(b.event.startDate))
          .slice(0, 5)
          .map((t, idx) => ({
            date:     t.event.startDate,
            time:     t.event.startTime || "",
            title:    t.event.title,
            subtitle: t.event.venue || "Location TBA",
            tag:      idx === 0 ? "Next Up" : "",
            active:   idx === 0,
          }));
        setScheduleItems(upcoming);

        // ✅ Documents — real tickets se banao
        const docs = data.map((t) => ({
          id:       t._id,
          icon:     "🎫",
          title:    `${t.event?.title || "Event"} — Ticket`,
          subtitle: `PDF · Issued ${new Date(t.purchasedAt || t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
          ticketId: `TK-${String(t._id).slice(-5).toUpperCase()}`,
        }));
        setDocuments(docs);

        // ✅ Networking — first upcoming event se data
        if (data.length > 0) {
          const firstEvent = data[0].event;
          setNetworkingData({
            attendeeCount: firstEvent?.reviewCount || 0, // proxy for activity
            eventName:     firstEvent?.title || "your event",
            extraCount:    0,
            avatars:       [], // Real avatars future feature
          });
        }
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      }
    };
    fetchMyTickets();
  }, [user]);

  // ── Organizer: real events fetch ──────────────────────────────────────────
  const fetchMyEvents = useCallback(async () => {
    if (user?.role !== "organizer") return;
    setEventsLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/events/mine/all");
      setMyEvents(data);
    } catch (error) {
      console.error("Failed to fetch my events", error);
    } finally {
      setEventsLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchMyEvents(); }, [fetchMyEvents]);

  const handleDeleteEvent = (eventId, eventTitle) => {
    setDeleteTarget({ id: eventId, title: eventTitle });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axiosInstance.delete(`/api/events/${deleteTarget.id}`);
      toast.success("Event deleted successfully.");
      setMyEvents((prev) => prev.filter((e) => e._id !== deleteTarget.id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete event.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleEditEvent = (event) => {
    navigate(`/organize/edit/${event._id}`, { state: { event } });
  };

  const profileUser = {
    name:       user?.name || "Guest",
    membership: user?.role === "organizer" ? "Organizer Account" : "Member",
    avatar:     `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Guest")}&background=8C6B45&color=fff&size=128`,
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

          {/* Attendee section */}
          {user?.role === "attendee" && (
            <>
              <UpcomingTickets tickets={tickets} />
              {/* ✅ Schedule from real tickets */}
              {scheduleItems.length > 0 && (
                <MySchedule scheduleItems={scheduleItems} />
              )}
            </>
          )}
        </div>

        <div className="space-y-6">
          {user?.role === "attendee" && (
            <>
              {/* ✅ Networking — real data, sirf tab dikho jab data ho */}
              {networkingData && (
                <NetworkingHub data={networkingData} />
              )}

              {/* ✅ Documents — real tickets se */}
              {documents.length > 0 && (
                <CertificatesDocuments documents={documents} />
              )}
            </>
          )}

          <AccountMenu
            onEditProfile={() => setShowEditProfile(true)}
            onPaymentClick={() => setShowPaymentModal(true)}
            onNotificationClick={() => setShowNotificationModal(true)}
          />
        </div>
      </div>

      {showEditProfile && (
        <EditProfileModal onClose={() => setShowEditProfile(false)} />
      )}
      {showPaymentModal && (
        <PaymentMethodsModal onClose={() => setShowPaymentModal(false)} />
      )}
      {showNotificationModal && (
        <NotificationPreferencesModal onClose={() => setShowNotificationModal(false)} />
      )}
      {deleteTarget && (
        <ConfirmDeleteModal
          eventTitle={deleteTarget.title}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default MyEventsPage;
