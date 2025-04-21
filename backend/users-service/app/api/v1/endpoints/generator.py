import os
from io import BytesIO

from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.services.generate_protocol import generate_certificate, generate_protocol

api_router = APIRouter()


class TeamScore(BaseModel):
    judge: str
    scores: list[int]


class TeamData(BaseModel):
    team: str
    participants: list[str]
    scores: list[TeamScore]


class ProtocolRequest(BaseModel):
    title: str
    data: list[TeamData]


@api_router.get("/generate-protocol/")
async def create_protocol(request: ProtocolRequest):
    output_file = "protocol.docx"
    try:
        generate_protocol(output_file, request.title, request.data)
        return FileResponse(
            output_file,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=output_file,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/generate_certificate/")
def create_certificate(name: str, place: str, event: str = None, date: str = None):
    buffer = BytesIO()
    generate_certificate(
        full_name=name, place=place, event=event, date=date, output_file=buffer
    )
    buffer.seek(0)
    return Response(content=buffer.read(), media_type="application/pdf")
