import { relations } from "drizzle-orm/relations";
import { events, restaurantRecommendations, letters, surveyResponses, invitations, invitationDesigns, invitationMessages, invitationPhotos, editorDocumentsV2, editorSnapshotsV2, rsvpResponsesV2, editorAssetsV2, guestbookMessagesV2, aiEditLogsV2, paperInvitationRequests, paperInvitationPhotos } from "./schema";

export const restaurantRecommendationsRelations = relations(restaurantRecommendations, ({one}) => ({
	event: one(events, {
		fields: [restaurantRecommendations.eventId],
		references: [events.id]
	}),
}));

export const eventsRelations = relations(events, ({many}) => ({
	restaurantRecommendations: many(restaurantRecommendations),
	letters: many(letters),
	surveyResponses: many(surveyResponses),
}));

export const lettersRelations = relations(letters, ({one}) => ({
	event: one(events, {
		fields: [letters.eventId],
		references: [events.id]
	}),
	surveyResponse: one(surveyResponses, {
		fields: [letters.surveyResponseId],
		references: [surveyResponses.id]
	}),
}));

export const surveyResponsesRelations = relations(surveyResponses, ({one, many}) => ({
	letters: many(letters),
	event: one(events, {
		fields: [surveyResponses.eventId],
		references: [events.id]
	}),
}));

export const invitationDesignsRelations = relations(invitationDesigns, ({one}) => ({
	invitation: one(invitations, {
		fields: [invitationDesigns.invitationId],
		references: [invitations.id]
	}),
}));

export const invitationsRelations = relations(invitations, ({many}) => ({
	invitationDesigns: many(invitationDesigns),
	invitationMessages: many(invitationMessages),
	invitationPhotos: many(invitationPhotos),
}));

export const invitationMessagesRelations = relations(invitationMessages, ({one}) => ({
	invitation: one(invitations, {
		fields: [invitationMessages.invitationId],
		references: [invitations.id]
	}),
}));

export const invitationPhotosRelations = relations(invitationPhotos, ({one}) => ({
	invitation: one(invitations, {
		fields: [invitationPhotos.invitationId],
		references: [invitations.id]
	}),
}));

export const editorSnapshotsV2Relations = relations(editorSnapshotsV2, ({one, many}) => ({
	editorDocumentsV2: one(editorDocumentsV2, {
		fields: [editorSnapshotsV2.documentId],
		references: [editorDocumentsV2.id]
	}),
	aiEditLogsV2s: many(aiEditLogsV2),
}));

export const editorDocumentsV2Relations = relations(editorDocumentsV2, ({many}) => ({
	editorSnapshotsV2s: many(editorSnapshotsV2),
	rsvpResponsesV2s: many(rsvpResponsesV2),
	editorAssetsV2s: many(editorAssetsV2),
	guestbookMessagesV2s: many(guestbookMessagesV2),
	aiEditLogsV2s: many(aiEditLogsV2),
}));

export const rsvpResponsesV2Relations = relations(rsvpResponsesV2, ({one}) => ({
	editorDocumentsV2: one(editorDocumentsV2, {
		fields: [rsvpResponsesV2.documentId],
		references: [editorDocumentsV2.id]
	}),
}));

export const editorAssetsV2Relations = relations(editorAssetsV2, ({one}) => ({
	editorDocumentsV2: one(editorDocumentsV2, {
		fields: [editorAssetsV2.documentId],
		references: [editorDocumentsV2.id]
	}),
}));

export const guestbookMessagesV2Relations = relations(guestbookMessagesV2, ({one}) => ({
	editorDocumentsV2: one(editorDocumentsV2, {
		fields: [guestbookMessagesV2.documentId],
		references: [editorDocumentsV2.id]
	}),
}));

export const aiEditLogsV2Relations = relations(aiEditLogsV2, ({one}) => ({
	editorDocumentsV2: one(editorDocumentsV2, {
		fields: [aiEditLogsV2.documentId],
		references: [editorDocumentsV2.id]
	}),
	editorSnapshotsV2: one(editorSnapshotsV2, {
		fields: [aiEditLogsV2.snapshotId],
		references: [editorSnapshotsV2.id]
	}),
}));

export const paperInvitationPhotosRelations = relations(paperInvitationPhotos, ({one}) => ({
	paperInvitationRequest: one(paperInvitationRequests, {
		fields: [paperInvitationPhotos.requestId],
		references: [paperInvitationRequests.id]
	}),
}));

export const paperInvitationRequestsRelations = relations(paperInvitationRequests, ({many}) => ({
	paperInvitationPhotos: many(paperInvitationPhotos),
}));