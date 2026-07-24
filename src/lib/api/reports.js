import { apiFetch } from "./client";

// ======================================================
// Reports
// ======================================================

export function createReport(payload) {

    return apiFetch("/reports", {

        method: "POST",

        body: JSON.stringify(payload)

    });

}

export function fetchReports(filters = {}) {

    const query = new URLSearchParams(filters).toString();

    return apiFetch(

        query

            ? `/reports?${query}`

            : "/reports"

    );

}

export function fetchReport(reportId) {

    return apiFetch(`/reports/${reportId}`);

}

// ======================================================
// Assignment
// ======================================================

export function assignReport(reportId, userId) {

    return apiFetch(

        `/reports/${reportId}/assign`,

        {

            method: "PATCH",

            body: JSON.stringify({

                userId

            })

        }

    );

}

// ======================================================
// Resolution
// ======================================================

export function resolveReport(

    reportId,

    resolutionNotes

) {

    return apiFetch(

        `/reports/${reportId}/resolve`,

        {

            method: "PATCH",

            body: JSON.stringify({

                resolutionNotes

            })

        }

    );

}

// ======================================================
// Reopen
// ======================================================

export function reopenReport(

    reportId,

    reason

) {

    return apiFetch(

        `/reports/${reportId}/reopen`,

        {

            method: "PATCH",

            body: JSON.stringify({

                reason

            })

        }

    );

}

// ======================================================
// Escalation
// ======================================================

export function escalateReport(reportId, userId, reason, type = "Emergency") {
    return apiFetch(`/reports/${reportId}/escalate`, {
        method: "PATCH",
        body: JSON.stringify({
            userId,
            reason,
            type
        })
    });
}

// ======================================================
// Notes
// ======================================================

export function addNote(

    reportId,

    text

) {

    return apiFetch(

        `/reports/${reportId}/notes`,

        {

            method: "POST",

            body: JSON.stringify({

                text

            })

        }

    );

}

// ======================================================
// Delete
// ======================================================

export function deleteReport(reportId) {

    return apiFetch(

        `/reports/${reportId}`,

        {

            method: "DELETE"

        }

    );

}

export function resolveEscalation(id, notes, resolution) {

    return apiFetch(`/reports/${id}/resolve-escalation`, {

        method: "PATCH",

        body: JSON.stringify({

            notes,
            resolution

        })

    });

}

// ======================================================
// Update Report
// ======================================================

export function updateReport(reportId, payload) {

    return apiFetch(

        `/reports/${reportId}`,

        {

            method: "PUT",

            body: JSON.stringify(payload)

        }

    );

}